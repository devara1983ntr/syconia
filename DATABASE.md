# SYCONIA — Database Design (PostgreSQL 16+ / Drizzle ORM)

| Field | Value |
|---|---|
| Document | DATABASE.md · v1.0.0 · 2026-09-03 |
| Status | Target schema `[REQUIRED]` — no database exists yet; this document is the authoritative implementation spec for `drizzle-kit` migrations. |

Conventions: `snake_case` identifiers; UUID PKs (`gen_random_uuid()`); `created_at/updated_at timestamptz NOT NULL DEFAULT now()`; soft-state enums as Postgres enums; all FKs `ON DELETE` explicit; all timestamps UTC. Money features absent by design (no payments — PRD §3.2). **No media blobs, ever.**

---

## 1. Entity overview

```
sources ──< videos >── video_categories >── categories
              │  \──── video_tags >──────── tags
              │  \──── mapping_rules (normalized into above)
              ├──< watch_events ──(rollup)──< daily_video_stats
              ├──< takedown_requests        daily_search_stats <── search_queries
              ├──< blocked_entries
              ├──< sync_runs
admin_users ──< admin_sessions        search_queries
      └──────< audit_log              system_settings (k/v)
```

## 2. Tables

### 2.1 `sources` — approved external content sources
| Column | Type | Rules |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| slug | text | NOT NULL UNIQUE, lowercase regex `^[a-z0-9-]{2,32}$` |
| display_name | text | NOT NULL, 2–64 chars |
| manifest | jsonb | NOT NULL — host allowlist[], rate budget, capability set (ARCHITECTURE §6) |
| terms_verified_at | timestamptz | NULL until operator verifies ToS/embed terms (LEGAL-COMPLIANCE §4) |
| terms_reference_url | text | NULL, https URL |
| is_enabled | boolean | NOT NULL DEFAULT false |
| priority | smallint | NOT NULL DEFAULT 100 (lower = first) |
| breaker_state | enum(`closed`,`open`,`half_open`) | NOT NULL DEFAULT `closed` |
| created_at / updated_at | timestamptz | NOT NULL defaults |

Lifecycle: created by admin (code-reviewed adapter module must exist); disabled → hidden from ingestion and UI, existing rows retained (provenance) but excluded from listings.

### 2.2 `videos` — normalized metadata cache (the catalog)
| Column | Type | Rules |
|---|---|---|
| id | uuid PK | |
| source_id | uuid | NOT NULL FK→sources(id) ON DELETE RESTRICT |
| source_video_id | text | NOT NULL; **UNIQUE(source_id, source_video_id)** |
| slug | text | NOT NULL UNIQUE — public URL id (`{words}-{shortid}`), regex `^[a-z0-9-]{3,96}$` |
| title | text | NOT NULL, 1–300 chars (source-provided; never fabricated) |
| description | text | NULL, ≤5000 chars |
| duration_seconds | integer | NULL CHECK (30–28800) |
| thumb_url | text | NOT NULL https, validated against source manifest at write |
| preview_url | text | NULL https (animated preview where source provides) |
| embed_url | text | NOT NULL https (official embed/player URL) |
| embed_type | enum(`iframe`,`player_api`) | NOT NULL DEFAULT `iframe` |
| capability_set | text[] | NOT NULL DEFAULT '{}' — shell capabilities (PRD2 §6) |
| metadata | jsonb | NOT NULL DEFAULT '{}' — preserved unknown source fields (never rendered raw) |
| published_at | timestamptz | NULL |
| first_seen_at / last_seen_at | timestamptz | NOT NULL defaults; last_seen bumped each sync |
| is_available | boolean | NOT NULL DEFAULT true |
| is_hidden | boolean | NOT NULL DEFAULT false — admin/takedown hide (sticky across syncs) |
| hidden_reason | enum(`admin`,`takedown`,`policy`) | NULL when visible |
| views_total | bigint | NOT NULL DEFAULT 0 (from rollups) |
| content_hash | text | NOT NULL — sha256(normalized core fields) for drift detection |

Indexes: UNIQUE(slug); UNIQUE(source_id, source_video_id); GIN `search_vector` (generated tsvector over title, weighted A, description B) with trigger refresh; GIN trigram on title (`pg_trgm` gin_trgm_ops); BTREE (is_available, is_hidden, published_at DESC); BTREE (source_id, last_seen_at DESC); BTREE (views_total DESC).
Lifecycle: upserted by sync; pruned to `unavailable` after 30d absent from source feed (configurable) unless hidden-for-takedown (retained as suppression record). Nothing is ever hard-deleted except by explicit admin purge (audited).

### 2.3 `categories` / 2.4 `tags` — closed local taxonomy
| categories | | tags | |
|---|---|---|---|
| id uuid PK | | id uuid PK | |
| slug text NOT NULL UNIQUE | | slug text NOT NULL UNIQUE | |
| name text NOT NULL 2–48 | | name text NOT NULL 2–48 | |
| description text ≤280 NULL | | description text ≤280 NULL | |
| hero_asset_path text NULL (brand-styled, local only) | | is_featured boolean DEFAULT false (Tags index page) | |
| sort_order integer NOT NULL DEFAULT 0 | | usage_count integer NOT NULL DEFAULT 0 (denormalized, trigger-maintained) | |
| is_visible boolean NOT NULL DEFAULT true | | created_at/updated_at | |
| created_at/updated_at | | Index: (usage_count DESC), UNIQUE(slug) | |
Indexes: UNIQUE(slug), (is_visible, sort_order) | | | |

### 2.5 `video_categories` / 2.6 `video_tags` — join tables
`video_id uuid FK→videos ON DELETE CASCADE`, `category_id`/`tag_id` FK ON DELETE CASCADE; PK (video_id, category_id|tag_id); indexes on the reverse side (taxonomy listing queries); attach/detach only via mapping rules or admin action (audited).

### 2.7 `mapping_rules` — source-term → local-taxonomy governance
| Column | Type | Rules |
|---|---|---|
| id uuid PK | | |
| source_id | uuid FK→sources ON DELETE CASCADE | NOT NULL |
| direction | enum(`category`,`tag`) | NOT NULL |
| pattern | text NOT NULL 1–64 | literal or regex |
| is_regex | boolean NOT NULL DEFAULT false | regex validated at admin save |
| local_category_id / local_tag_id | uuid FK | exactly one NOT NULL (CHECK mutual exclusion) |
| priority | smallint NOT NULL DEFAULT 0 | first match wins |
| is_active | boolean NOT NULL DEFAULT true |
| hit_count / last_hit_at | integer / timestamptz | maintained by pipeline (gap analysis, PRD2 §7) |

### 2.8 `watch_events` — anonymous viewing events (raw; retention 90d)
id uuid PK · session_id uuid NOT NULL (cookie `sy_sid`, not a person) · video_id uuid FK→videos ON DELETE CASCADE NOT NULL · event enum(`start`,`q25`,`q50`,`q75`,`end`) NOT NULL · watched_at timestamptz NOT NULL DEFAULT now().
Indexes: (video_id, watched_at DESC); (watched_at) for purge scans. **No IP, no UA string, no identifiers beyond rotating session uuid.**

### 2.9 `daily_video_stats` — rollup (indefinite retention)
id uuid PK · video_id uuid FK ON DELETE CASCADE NOT NULL · day date NOT NULL · views_24h int · quartile_avg numeric(4,3) · trending_score numeric(10,4) · computed_at timestamptz.
UNIQUE(video_id, day); index (day DESC, trending_score DESC).

### 2.10 `search_queries` — query log (retention 90d)
id uuid PK · query text NOT NULL (1–120) · result_count int NOT NULL · was_relaxed boolean NOT NULL DEFAULT false · created_at.
Indexes: (created_at); trigram GIN on query for trending-aggregation. `daily_search_stats` (day PK, total, zero_result_count, top_queries jsonb) rollup.

### 2.11 `takedown_requests` — compliance queue
| Column | Type | Rules |
|---|---|---|
| id uuid PK | | |
| video_id | uuid FK→videos | NULLABLE if reporter cites a source URL not yet in catalog |
| source_url_claimed | text | https; used when video_id NULL |
| reporter_name | text | NULL (optional) |
| reporter_email | text | NULL, RFC-valid when present |
| reason | enum(`copyright`,`underage`,`nc /*non-consensual*/`,`other_legal`,`wrong_meta`,`broken`) | NOT NULL |
| details | text | ≤1000 |
| status | enum(`new`,`under_review`,`actioned`,`rejected`,`escalated`) | NOT NULL DEFAULT `new` |
| action | enum(`hidden`,`blocked_source_wide`,`reported_to_source`,`none`) | NULL until resolved |
| received_at / resolved_at / resolved_by | timestamptz / timestamptz / uuid FK→admin_users | |
Indexes: (status, received_at) — queue SLA queries (PRD2 §9 alert).

### 2.12 `blocked_entries` — suppression records (sticky)
id · source_id FK NOT NULL · source_video_id text NOT NULL · scope enum(`video`,`pattern`) · pattern text NULL · reason enum(takedown,policy) NOT NULL · created_by uuid FK→admin_users NOT NULL · created_at.
UNIQUE(source_id, source_video_id) where scope=video. Sync must consult this table before every insert/update (FR-8); E2E T-31 proves stickiness.

### 2.13 `admin_users`
id uuid PK · username text NOT NULL UNIQUE (3–32) · password_hash text NOT NULL (argon2id) · is_active boolean NOT NULL DEFAULT true · created_at · last_login_at NULL. Seeded from `ADMIN_PASSWORD_HASH` env on first boot only.

### 2.14 `admin_sessions`
id uuid PK · admin_user_id FK ON DELETE CASCADE NOT NULL · token_hash text NOT NULL UNIQUE (sha256 of signed cookie value) · ip_prefix text NULL (truncated) · user_agent_hash text NULL · created_at · last_seen_at · expires_at NOT NULL (CHECK expires_at > created_at; 8h idle / 24h absolute enforced by service layer). Purged nightly.

### 2.15 `audit_log` — every admin mutation (append-only)
id · admin_user_id FK NOT NULL · action text NOT NULL (enum-like whitelist: `video.hide`, `video.unhide`, `category.create`, … full list in API.md §8) · entity_type · entity_id · diff jsonb (before/after, secrets excluded) · request_id text · created_at. Index (admin_user_id, created_at DESC), (entity_type, entity_id). **No updates/deletes by application policy; DB role has no UPDATE/DELETE grant on this table.**

### 2.16 `sync_runs` — pipeline observability
id · source_id FK NOT NULL · started_at/finished_at NOT NULL/NULL · status enum(running,success,partial,failed) NOT NULL · items_seen/added/updated/failed int NOT NULL DEFAULT 0 · error text NULL · duration_ms int. Index (source_id, started_at DESC).

### 2.17 `system_settings` — typed feature flags (PRD2 §8)
key text PK · value jsonb NOT NULL · updated_by uuid FK→admin_users NULL · updated_at. Reads cached 60s; writes audited.

## 3. Relationships summary
- sources 1—N videos (RESTRICT delete: provenance integrity)
- videos N—N categories/tags (via joins, mapping-rule-driven)
- videos 1—N watch_events → rollups 1—N daily_video_stats
- takedown_requests N—1 videos (nullable) · blocked_entries N—1 sources/admin_users
- admin_users 1—N admin_sessions / audit_log

## 4. Search configuration
- Generated column: `search_vector tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english', coalesce(title,'')),'A') || setweight(to_tsvector('english', coalesce(description,'')),'B')) STORED` + GIN.
- `CREATE EXTENSION pg_trgm` (idempotent migration) + GIN trgm index on `videos.title`, `search_queries.query`.
- All search SQL parameterized through Drizzle (SECURITY.md §7 — injection prevention).

## 5. Index strategy rationale
| Query path | Index |
|---|---|
| Home rails (trending/new/most watched) | (is_available,is_hidden,published_at DESC); (views_total DESC); rollup (day,trending_score) |
| Category listing | join reverse index + (is_visible, sort_order) |
| Search | GIN tsvector; GIN trgm |
| Slug lookups | UNIQUE(slug) |
| Sync upserts | UNIQUE(source_id, source_video_id) |
| Stale pruning | (source_id, last_seen_at DESC) |
| SLA queue | (status, received_at) |
| Purge scans | (watched_at), (created_at) on 90d tables |

## 6. Data lifecycle & retention
| Data | Retention | Mechanism |
|---|---|---|
| videos rows | while available + 30d grace; hidden-takedown rows indefinite | sync prune job |
| watch_events (raw) | 90d default (30–180 tunable) | nightly purge job (audited) |
| search_queries (raw) | 90d | same |
| rollups | indefinite (aggregate) | — |
| admin_sessions | expiry + 7d | nightly purge |
| sync_runs | 180d | purge job |
| audit_log | indefinite (compliance) | append-only |

Backups: PITR on managed Postgres (Neon) or nightly base + WAL on VPS; restore drill quarterly (SOP.md §8). Restore targets: RPO ≤ 15min, RTO ≤ 2h.

## 7. Permissions & roles (DB level)
| Role | Grants |
|---|---|
| `syconia_app` | SELECT/INSERT/UPDATE on business tables; **no** DELETE except via purge job role; UPDATE/DELETE **denied** on `audit_log`; no DDL |
| `syconia_jobs` | purge + rollup grants incl. targeted DELETE on retention tables; no DDL |
| `syconia_migrate` | DDL for migrations only, run in CI/CD, never at runtime |
| `syconia_admin_read` (optional break-glass) | SELECT-only for incident ops |

No `SUPERUSER` at runtime; connection strings scoped per role (DEPLOYMENT.md §5).

## 8. Migration policy
drizzle-kit generate → reviewed SQL in PR → CI applies to ephemeral DB + runs integration tests → deploy applies to prod before traffic shift → forward-only (no down-migrations in prod; rollback = redeploy previous build with compatible schema; destructive changes ship as two-phase expand/contract). Gate G-4 in CI-CD.md §4.

## 9. Constraints recap (invariants)
1. UNIQUE(source_id, source_video_id) — dedup. 2. UNIQUE(slug) — stable URLs. 3. `blocked_entries` consulted on every upsert — FR-8. 4. audit_log append-only at grant level. 5. No media columns anywhere. 6. All FK actions explicit. 7. All enums closed sets. 8. CHECK constraints on bounded fields (duration, char lengths, session expiry).

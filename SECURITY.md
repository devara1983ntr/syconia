# SYCONIA — Security Architecture, Threat Model & Checklist

| Field | Value |
|---|---|
| Document | SECURITY.md · v1.0.2 · 2026-09-03 · `[REQUIRED]` controls |

---

## 1. Security objectives
Protect: visitors (privacy, discretion), the platform (integrity, availability), the operator (compliance posture), and partners/sources (no abuse of their services). Posture: assume hostile internet; zero-trust toward all external data (source metadata is untrusted input); least privilege everywhere.

## 2. Trust boundaries
1. Browser ↔ SYCONIA origin (HTTPS-only). 2. SYCONIA server ↔ external source APIs (outbound, allowlisted). 3. SYCONIA server ↔ database (scoped roles). 4. Third-party embed iframe (inside player stage — treated as untrusted content in a sandboxed frame). 5. Admin ↔ admin plane (authenticated).

## 3. Transport & HTTPS
- HTTPS everywhere, HSTS `max-age=63072000; includeSubDomains; preload` (submitted to preload list after launch); no plaintext listeners; HTTP → HTTPS 308 redirect at edge; TLS 1.2+ (1.3 preferred), modern cipher suite only; certificates managed by platform (DEPLOYMENT §3). Secure cookies flagged (`Secure`) exclusively.
- Internal service-to-service (jobs) still TLS when crossing hosts; DB connections TLS required.

## 4. Security headers (middleware, every response — CSP is the centerpiece)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}' 'strict-dynamic';
  style-src 'self' 'unsafe-inline';          /* token layer needs inline vars; no third-party styles */
  img-src 'self' data:;                     /* all thumbnails served via the /_next/image proxy
                                            (same-origin); data: for inline placeholder art only */
  media-src 'none';                          /* no media on our origin — ever */
  frame-src https://{source-host-allowlist}; /* per-manifest, from enabled sources only */
  connect-src 'self';
  font-src 'self';
  object-src 'none'; base-uri 'self';
  form-action 'self'; frame-ancestors 'self';
  upgrade-insecure-requests; report-uri /api/csp-report
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
X-Frame-Options: SAMEORIGIN                  /* SYCONIA pages are never embeddable elsewhere */
X-DNS-Prefetch-Control: off
Cache-Control: no-store                      /* on /api/admin/** and watch beacons only */
```
`frame-src` is generated from *enabled* sources' manifests — disabling a source removes it from CSP at the next deployment window; CSP violations are logged (report-only first on any change — SOP §7).

## 5. XSS prevention
- React/JSX text interpolation everywhere (auto-escaping); `dangerouslySetInnerHTML` is banned by lint rule (CI gate G-8) — legal pages are rendered from React MDX components, not raw HTML strings.
- Source-provided text (titles, descriptions) treated as untrusted: normalized at ingestion (charset normalization, control-char strip, length clamps) and rendered as text nodes; the rare rich field passes a strict server-side sanitizer (allowlist: `p br strong em a[rel]`) before storage.
- URL fields validated twice (ingestion + render) against manifest host allowlists (https, no userinfo, standard ports, no `javascript:`/`data:` schemes possible by construction).
- CSP as second line (§4). No third-party scripts at all — analytics is first-party.

## 6. CSRF, session tokens & cookie contracts
State-changing endpoints are admin-only (cookie `SameSite=Strict` + per-session CSRF token + Origin check) and public `POST /api/report` + `POST /api/contact` (double-submit token + Origin check + rate limit). Age cookie is `SameSite=Lax` (never authorizes writes). Beacons are idempotent inserts with no privilege.

**Cookie contracts (normative):**
- **Age cookie** `sy_age_ok`: HttpOnly, Secure, SameSite=Lax, 12 months. Payload format: `<exp-epoch-seconds>.<hex-hmac-sha256(exp, AGE_SECRET)>` — verified server-side (expiry + signature); malformed/expired/forged = absent (403 path). The localStorage mirror is a non-authoritative UX hint only (the server never reads it).
- **Admin session cookie** `sy_admin`: HttpOnly, Secure, SameSite=Strict, 8h idle / 24h absolute. Payload: opaque 256-bit random token; `admin_sessions` stores only `sha256(token)`; no role/claim data in the cookie.
- **CSRF issuance/rotation:** on successful login the server returns `{ csrfToken }` in the body **and** sets a readable (non-HttpOnly) `sy_csrf` cookie; every admin mutation must echo it in the `x-csrf-token` header (compared to the session-bound value). Token is rotated on every login and invalidated on logout/session expiry. Public report/contact use the classic double-submit pattern (token cookie + header echo) with no session binding.
- **Admin lockout scope:** the failure counter is maintained **per username AND per truncated IP** — either counter reaching 5 within 15 minutes locks both keys for 15 minutes (audited `auth.fail`); attempts against a nonexistent username still count toward the IP counter (no username enumeration).

## 7. SQL injection prevention
Drizzle ORM parameterizes every query (no string-built SQL); search uses tsvector/trigram operators with bound parameters; dynamic sort/filter keys are enum-mapped server-side (never interpolated identifiers); DB roles cannot execute DDL (DATABASE §7); logs never contain raw SQL with user input.

## 8. SSRF protection (adapter plane)
- Single HTTP wrapper (ARCHITECTURE §6): manifest host allowlist per adapter; URL parsing (scheme https, host suffix match, no userinfo, port 443); DNS resolution validated against private/link-local CIDRs (IPv4+IPv6) before connect and on every redirect hop (cross-host redirect = abort); 10s timeout, 5MB body cap; no user-supplied URL ever fetched (report forms store, never fetch).
- Image proxy (`next/image`): `remotePatterns` mirror the union of enabled manifests; no wildcard hosts.

## 9. Input validation & output sanitization (summary)
All external input (query params, bodies, source payloads) validated by Zod at the boundary with strict schemas (types, enums, lengths 1–300/120/1000/2000, formats). Output: React escaping; JSON responses typed by DTO contract (API.md §4); error envelopes leak no internals (message + code + requestId only).

## 10. Rate limiting & abuse prevention
Per truncated-IP sliding windows (API.md §2). Additional guards: age-cookie HMAC-signed (forgery → 403), cursors HMAC-signed (tamper → 400), admin lockout (5/15min, audited), report endpoint honeypot field + submit-time throttle, suggest endpoint bounded (8), beacon batching caps. Layer 7 DDoS: platform WAF/CDN (DEPLOYMENT §6) + graceful `Retry-After` responses; static ISR pages keep origin load minimal.

## 11. Secrets management
- Secrets only via environment variables (validated at boot); never in code, never client-side, never in logs. Local dev: `.env.local` (git-ignored; CI secret-scan gate G-6 blocks commits matching secret patterns). Rotation runbook: SOP §10 (keys rotate without downtime: dual-validity window for HMAC secrets).
- Admin credentials seeded from `ADMIN_PASSWORD_HASH` (argon2id, 19MiB/t=2/p=1 minimum) — plaintext passwords never stored or logged.

## 12. Privacy controls (architecture-level)
No accounts; anonymous rotating `sy_sid` (30d) for aggregate analytics only; IPs truncated (v4 /24, v6 /48) in rate-limit keys — never stored in events; UA not persisted (capability class only); DNT respected (events disabled); "Clear session traces" control (UX-FLOWS §14); access logs strip query strings on watch routes; raw events purged at 90d (DATABASE §6); no third-party trackers/analytics/fonts (self-hosted OFL fonts); privacy policy states all of this truthfully.

## 13. API-source validation (upstream trust)
Every adapter payload is untrusted: Zod-validated field-wise (PRD2 §6), size/duration plausibility-checked, embed URLs allowlist-checked at ingestion **and** render (defense in depth), unknown fields quarantined to JSONB never rendered raw. Terms verification gate before any source is enabled (API.md §6.1; LEGAL-COMPLIANCE §4). No source HTML is ever parsed for playback URLs — official embed endpoints only (anti-scraping posture + ToS compliance).

## 14. Dependency & supply-chain security
Lockfile-only installs (`npm ci`); weekly `npm audit` + automated dependency PRs (SOP §11); CI gate G-5 blocks High/CRIT advisories; pinned action hashes in CI; SBOM generated per release `[PROPOSED]`; no runtime `eval`-class code; fonts from audited SIL-OFL sources (Fraunces, Inter); icons via lucide-react (ISC license); brand assets are project-proprietary (guidelines PDF §"Confidential & Proprietary") — license compliance recorded per dependency in the release record.

## 15. Threat model (STRIDE summary)
| Threat | Vector | Control |
|---|---|---|
| Spoofing | Forged age/admin cookies | HMAC signing; argon2 + lockout; SameSite |
| Tampering | Cursor forgery; DB tampering via SQLi; embed URL swap | Signed cursors; parameterization + scoped roles; double URL validation |
| Repudiation | Admin denies action | Append-only audit_log (no UPDATE/DELETE grants) |
| Information disclosure | Content before age gate; PII in logs; error leakage | Server-side gate; truncation rules; opaque errors + requestIds |
| Denial of service | L7 floods; source hammering | Rate limits; ISR/CDN absorption; adapter rate budgets + breakers |
| Elevation of privilege | Admin API access without session | Middleware guard + session checks + audit |
| Supply chain | Malicious dep/advisory | Lockfiles, audits, pinned CI |
| Clickjacking | SYCONIA framed elsewhere | frame-ancestors 'self' + XFO |
| Magecart-class | Third-party script injection | CSP strict-dynamic; zero third-party scripts |

## 16. Incident response (summary — full runbook SOP §9)
Severity classes S1–S3; on-call channel; containment-first doctrine (kill-switches: disable source, maintenance mode); forensic timestamps from audit_log + structured logs; disclosure obligations assessed per LEGAL-COMPLIANCE §8; post-mortem template in SOP §9.4.

## 17. Production security checklist (gate — PRE-RELEASE §8 references this)
□ HTTPS + HSTS preload verified □ CSP verified against live frame-src needs (report-only first) □ all headers present on every route (automated header test) □ age gate enforced server-side (pen-test case T-70) □ admin: lockout + audit + noindex verified □ rate limits active in prod □ secrets scanned + rotated post-first-deploy □ dependency audit clean □ DB roles verified (no superuser runtime) □ backups encrypted + restore drill done □ CSP/report endpoint monitored □ pen-test pass (OWASP WSTG-lite scope) □ privacy policy matches actual data flows.

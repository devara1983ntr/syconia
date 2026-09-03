# SYCONIA — Legal & Compliance Specification

| Field | Value |
|---|---|
| Document | docs/LEGAL-COMPLIANCE.md · v1.0.1 · 2026-09-03 · Audience: operator (Roshan) + counsel |
| Purpose | The compliance frame referenced by PRD §5, SECURITY.md §12, DEPLOYMENT.md §2 and PRE-RELEASE.md §15. This is a specification of obligations and controls, not legal advice — final copy and jurisdictional strategy require qualified counsel. |

---

## 1. Service characterization (truthful)
SYCONIA is an adult (18+) media discovery platform that presents third-party content via those parties' official embed mechanisms, with no hosting, production, or distribution of media files by SYCONIA. Every surface where the business is described — legal pages, footers, host/registrar/payment-adjacent paperwork — must use this accurate characterization. Discreet **product UX** (restrained branding, neutral tab title, no explicit UI imagery) is legitimate presentation; misrepresentation **to institutions** is not (see §3).

## 2. Age control
- Mandatory 18+ self-certification gate, server-enforced (signed cookie), before any content (PRD F-01; SECURITY §10).
- Jurisdictional reality: an increasing number of jurisdictions (e.g., several U.S. states, the UK's Online Safety Act framework, various EU national regimes) impose age-assurance duties that self-certification may not satisfy for adult sites accessible in those markets. Controls specified: (a) architecture hook for a certified age-verification provider `[PROPOSED]` phase-2; (b) admin geo-policy capability (country/state-level block or gate-hardening) via `system_settings` `[REQUIRED]` mechanism, enabled per operator's counsel decision per market; (c) documented review cadence quarterly (DEPLOYMENT §9).
- The operator maintains a target-markets list with per-market posture (open / hardened gate / blocked) — reviewed with counsel and recorded in release records.

## 3. Business representation policy (conflict C-2 resolution)
The supplied brand guidelines' §5 ("Corporate Decoy Deployment") directs presenting a false mainstream identity to financial auditors, processors, and regulators. **This project explicitly rejects that strategy**: misrepresenting the nature of a business to financial institutions or regulators can constitute fraud and violates the project's own Brand Safety mandate (master spec §17). Required correction wherever such direction would surface: merchant descriptors, incorporation papers, host registrations, and app-store/processor disclosures must truthfully describe an adult-media platform. Discretion (neutral naming of *holding entities* is permissible only where the descriptor remains accurate and permitted by the counterpart's rules) — never deception.

## 4. Third-party content sources
- Eligibility: sources offering official APIs/feeds/embed programs whose terms permit third-party metadata aggregation + embedding. Before enabling: operator records terms reference URL + verification date (admin Sources gate — API §6.1, SCREENS A-06).
- **No automatic grant:** an API key, public feed, or embeddable snippet is not itself a licence to redistribute, re-host, or aggregate; per-source terms must affirmatively permit the use we make of them, and silence or ambiguity disables the source until resolved (API.md §6.1).
- Prohibited: circumventing paywalls/geoblocks or technical measures; bulk scraping outside documented programs; misrepresenting our client to the source.
- Attribution & provenance: every watch page shows "Provided by {source}" (PRD F-07). Embeds honor source branding/controls (we do not strip attribution — embed terms generally require it).
- Rate respect: adapter rate budgets + circuit breakers (ARCHITECTURE §6) keep usage within documented limits.

## 5. Copyright / DMCA posture
- Designated agent page (`/legal/dmca`) with agent contact (operator fills before production — PRE-RELEASE §15 gate).
- Takedown intake: public report path + email channel; reasons include `copyright`; copyright claims auto-hide pending review (safe-harbor posture, API §4.9).
- SLA: action within 48h (target 24h); repeat-infringer policy documented (source-level blocks via `blocked_entries` patterns); full log in `takedown_requests` + `audit_log` (DATABASE §2.11–2.12).
- Counter-notice procedure documented in DMCA copy.

## 6. Prohibited content policy (zero tolerance)
No content that: involves minors in any way; depicts non-consent or real violence; is unlawful in the operator's or viewers' jurisdictions; infringes rights not covered by DMCA. Controls: critical report reasons auto-hide immediately; escalation path = preserve record → report to source platform → counsel; law-enforcement cooperation policy in Terms. Watch-page report reasons encode this taxonomy (API §4.9).

## 7. 2257 / provenance statement
SYCONIA produces no content and stores no media; the `/legal/2257` page states this accurately and links each enabled source's own compliance/2257 statement where available (stored in source manifest). This statement is a provenance disclosure — it must never imply SYCONIA maintains 2257 records it does not have.

## 8. Privacy regulation posture
No accounts; minimal first-party analytics; truncated IPs; 90-day raw-event retention; DNT honored; no third-party trackers (SECURITY §12). Privacy policy must mirror actual flows (verified at PRE-RELEASE §5/§15). Cookie notice: first-party cookies only (`sy_age_ok`, `sy_sid`, admin session) — consent posture per target-market counsel (likely "strictly necessary + inform" model; no tracking cookies to consent to).

## 9. Jurisdictional notes (operator checklist — counsel-confirmed before launch)
- Target markets list + per-market posture (§2). - Blocking capability tested (geo-policy mechanism). - RTA label deployed (SEO §5). - Age-assurance obligations review per market. - Consumer-law terms review (Terms/Privacy enforceability). - Record-keeping for takedown/log retention aligned with obligations.

## 10. Content-review workflow integration
All compliance operations are product features, not side files: takedown queue (A-08), blocks (FR-8 sticky), audit trail, SLA alerts (PRD2 §9), daily ops rhythm (SOP §12). Compliance artifacts (agent info, market list, drills) live in `/docs/releases/` records.

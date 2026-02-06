# Gold Box Revival Updated Roadmap (Text Version)
Last updated: 2026-02-06
Replaces: `Gold_Box_Revival_Game_Development_Foundation.docx`

## 1) Current Repository State (Reality Check)
- Current implementation is a local PixiJS + TypeScript prototype, not the full Rust + WebSocket architecture described in the foundation doc.
- Implemented today:
  - First-person dungeon renderer with depth frames and minimap.
  - Grid dungeon map and basic player movement/turning.
  - Vite build scaffolding and static `dist/` output.
- Missing today:
  - No backend service, no persistence, no networking.
  - No combat system, no rules engine, no content pipeline, no tests, no CI.
  - No documented ORC compliance artifacts.
- Build status on this machine:
  - `npm run build` currently fails because `tsc` is not installed in the environment (dependencies not installed locally).

## 2) Missing Information Identified
### ORC Rules and Licensing Gaps
- The project currently has no explicit ORC publication/compliance workflow.
- ORC requires a license notice and clear declarations of:
  - what in this project is Licensed Material,
  - what is Reserved Material,
  - and contributed material under ORC.
- ORC AxE clarifies software/video game use is allowed, but adaptations of Licensed Material used in the product must be shared under ORC.
- Trademark and product identity controls are separate from ORC:
  - Paizo names/logos and compatibility badges require Paizo policy compliance (and compatibility license where applicable).
  - ORC alone does not grant Pathfinder trademark usage rights.
- Existing data strategy (`archives_of_nethys_investigation.md`) is technically useful but not sufficient for legal provenance tracking of each imported rules element.

### Pathfinder Remastered Gaps
- The foundation doc references Remaster broadly, but does not define a concrete "Remaster-first" content baseline and legacy handling strategy.
- The roadmap is missing:
  - source-of-truth ordering for Player Core, GM Core, Monster Core, and Player Core 2,
  - a legacy-to-remaster rules crosswalk,
  - migration handling for content that still exists in legacy form only,
  - acceptance criteria for remaster parity in the game rules engine.
- Official messaging confirms Remaster is not a new edition ("not 2.5"), so compatibility and mixed legacy/remaster content handling must be explicit.

## 3) Updated Delivery Strategy
Use a phased approach that matches the actual codebase maturity and closes legal/rules gaps before content scale-up.

## 4) Roadmap (Updated)
## Phase 0 - Governance and Compliance Foundation (Weeks 1-2)
Deliverables:
- `docs/compliance/orc-compliance-plan.md`
- `docs/compliance/orc-notice-template.md`
- `docs/compliance/material-registry.csv` (columns: item, source, license basis, reserved/licensed)
- `docs/rules/source-priority.md` (Remaster-first ordering)

Acceptance criteria:
- ORC notice template includes required elements from ORC Article III (Required Notice).
- Material registry exists and is required for every rules/content import PR.
- Team decision documented on Pathfinder compatibility marks and naming policy.

## Phase 1 - Technical Baseline Hardening (Weeks 3-5)
Deliverables:
- Installable local dev setup (`npm ci`, `npm run build`, `npm run dev`) documented.
- Lint + typecheck + unit-test scaffolding.
- CI workflow for build + tests.

Acceptance criteria:
- Green CI on every PR.
- Prototype still renders at 60 FPS on target desktop baseline.

## Phase 2 - Rules Engine Vertical Slice (Weeks 6-9)
Scope:
- Implement one encounter loop with:
  - initiative,
  - 3-action economy,
  - basic strike resolution,
  - conditions subset.

Deliverables:
- Deterministic rules module with test coverage.
- Combat debug UI panel showing action consumption and rule outcomes.

Acceptance criteria:
- Replayable deterministic combat test fixtures.
- Rule outcomes logged with source references for auditability.

## Phase 3 - Remaster Data Integration (Weeks 10-14)
Scope:
- Build import pipeline for Remaster baseline entities first (ancestries, classes, feats, spells needed by the vertical slice).
- Add legacy/remaster crosswalk table where names or mechanics diverge.

Deliverables:
- `docs/rules/remaster-crosswalk.csv`
- `docs/rules/content-coverage.md`
- Import validation scripts (schema + provenance checks).

Acceptance criteria:
- Every imported rules element has provenance and license classification.
- Coverage report shows percentage of target Remaster baseline implemented.

## Phase 4 - Dungeon + Combat Fusion (Weeks 15-19)
Scope:
- Transition from pure exploration prototype to integrated exploration-to-combat state machine.
- Add encounter triggers and post-combat state persistence in-memory.

Deliverables:
- Playable loop: explore -> trigger combat -> resolve -> return to exploration.
- Save/load for local session state.

Acceptance criteria:
- End-to-end loop playable without manual reset.
- No blocker bugs in 30-minute internal playtest sessions.

## Phase 5 - Content Authoring and Tooling (Weeks 20-26)
Scope:
- Authoring format for encounters, maps, and loot with explicit license provenance fields.
- Initial campaign slice using original setting content.

Deliverables:
- `content/` schema docs and validators.
- First content pack with at least:
  - 1 town hub,
  - 2 dungeon floors,
  - 8-12 encounters.

Acceptance criteria:
- Content can be added without code changes.
- Provenance validator blocks non-compliant content merges.

## Phase 6 - Production Readiness (Weeks 27-32)
Scope:
- Performance profiling, UX polish, accessibility pass, release packaging.
- Legal release review for ORC notices and trademark compliance text.

Deliverables:
- Release checklist and signed compliance review.
- Public-facing legal/about page content.

Acceptance criteria:
- Stable beta build with documented known issues.
- Compliance checklist fully complete before release candidate tagging.

## 5) Milestone Gates (Must Pass)
1. **Gate A (end Phase 0):** ORC compliance process operational.
2. **Gate B (end Phase 2):** Rules vertical slice deterministic and test-backed.
3. **Gate C (end Phase 3):** Remaster data provenance + crosswalk complete for implemented scope.
4. **Gate D (end Phase 6):** Legal + technical release readiness signed off.

## 6) Immediate Next Sprint Backlog (First 10 Tasks)
1. Add `docs/compliance/` and `docs/rules/` directories.
2. Create ORC notice template and material registry.
3. Document Remaster source-priority policy (Remaster-first).
4. Add `npm ci` setup instructions and verify build in clean env.
5. Add test runner and first deterministic dice/rules tests.
6. Refactor current movement logic into a pure game-state update module.
7. Add combat state container with action counters.
8. Implement one weapon strike resolution path.
9. Add structured rule-source metadata to every implemented rule.
10. Draft `remaster-crosswalk.csv` schema and seed initial rows.

## 7) Key Risks and Mitigations
- Risk: building on unofficial/uncurated data without provenance.
  - Mitigation: mandatory source registry + validation in CI.
- Risk: ORC compliance done late.
  - Mitigation: Gate A before major content ingestion.
- Risk: roadmap overreach versus current prototype maturity.
  - Mitigation: strict gate-based progression and vertical slices.

## 8) Source Notes (for this roadmap update)
- ORC License text and required notice framework:
  - https://www.orclicense.com/orclicense
- ORC AxE clarifications, including software/video game treatment:
  - https://www.orclicense.com/faq
- Paizo remaster FAQ and project positioning ("not a new edition"):
  - https://paizo.com/pathfinder/remaster/faq
- Paizo compatibility and trademark policy entry points:
  - https://paizo.com/licenses
- Archives of Nethys remaster update behavior and legacy/remaster content handling:
  - https://2e.aonprd.com/

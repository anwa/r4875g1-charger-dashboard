# AGENTS.md

## Scope

These rules apply to the complete `r4875g1-charger-dashboard` repository.

## Language

- Source code, commit messages, changelog entries and project documentation are written in English.
- Home Assistant user-facing translations must be maintained in at least English and German when translation files are introduced.
- If one Home Assistant translation language changes, the corresponding English and German files must be checked and kept in sync.

## Architecture

- The Charger Controller remains authoritative for charger lifecycle, CAN communication, safety checks, thermal protection, START eligibility and blackstart behavior.
- The dashboard is an HMI only. It must not duplicate or weaken Controller safety logic.
- Frontend code must use Backend API semantic roles instead of installation-specific Home Assistant entity IDs.
- A successful backend control call means only that the Home Assistant service call completed. The frontend must observe semantic Controller state before presenting a requested state transition as complete.
- Prefer a consistent reusable architecture over local workarounds, even when the consistent solution requires more refactoring.
- Keep Home Assistant transport/API access out of purely presentational components where practical.
- Grafana history dashboards under `grafana/` are read-only analysis surfaces and must not become part of the Charger control path.
- Grafana must read existing Home Assistant time-series data directly from the configured InfluxDB data source; do not proxy or duplicate historical data through Backend API v1.
- Grafana dashboard queries must not hard-code installation-specific Charger entity prefixes or Grafana data-source UIDs. Use the shared `${instance}` and `${datasource}` variables instead.
- Keep the version-controlled Grafana dashboard importable through normal Grafana dashboard import and compatible with Grafana Git Sync.
- Prefer the Grafana V2 dashboard resource model and remove volatile server-generated metadata and installation-specific current variable selections before committing exported JSON.

## Change workflow

- Work in small, reviewable functional steps.
- Before implementing a change, inspect the current local branch and relevant repository rules.
- Edit files directly in the local working tree. Keep each change limited to the current concern and review the resulting diff before reporting it as complete.
- Run `npm run typecheck`, `npm run build` and `git diff --check` locally before committing functional frontend changes, and report the results.
- Rebuild and include `dist/r4875g1-charger-dashboard.js` whenever source changes affect the distributable bundle.
- Do not claim runtime testing that has not actually been performed in Home Assistant.
- Provide a patch that passes `git apply --check` only when the user asks for one or the working tree cannot be edited directly.

## Repository access

- Treat GitHub as read-only for the assistant. Do not perform repository mutations through GitHub or a GitHub integration.
- The assistant may create a local feature branch and local commits when the user asks for commits. Do not commit directly on `main` unless the user says so.
- The assistant must not push, merge into `main`, create or move tags, publish GitHub Releases, delete branches or rewrite commits that already exist on the remote. The user performs these steps.

## Versioning

- Every commit that changes runtime behavior, source code, packaging, build output or other functionality must increase the project version.
- Documentation-only commits may omit a version increase.
- Keep `package.json` and the root package version in `package-lock.json` synchronized.
- Use a patch increment for small fixes, refinements and narrowly scoped functional changes.
- Use a minor increment for substantial new functionality, new user-facing capabilities or larger backward-compatible feature milestones.
- A major increment is reserved for breaking compatibility or a major architectural milestone. The assistant must propose and discuss a major version with the user before applying it.
- Do not defer a required version increment to a later commit.

## Release workflow

- A minor or major version commit is a release checkpoint.
- Minor and major versions must be merged to `main`.
- After the merge, create an annotated Git tag named `v<version>` that points to the exact release commit.
- Publish a GitHub Release for the same tag and version.
- The user performs the merge, tag and GitHub Release. The assistant must provide the user with all required release material, including:
  - commit message, or the local commit when the user asked the assistant to commit
  - merge commands
  - tag command and tag message
  - release title
  - release notes
  - verification commands
  - branch cleanup commands when appropriate
- Patch increments do not require a GitHub Release unless explicitly chosen for that change.
- Any dashboard version intended to be distributed or offered as an update through HACS must be published as a full GitHub Release; a Git tag alone is not sufficient for the HACS release workflow.
- Before publishing a HACS-facing release, verify that `dist/r4875g1-charger-dashboard.js` exists and still matches the repository filename expected by HACS.
- `CHANGELOG.md` and user-facing release documentation must be updated for minor and major releases.

## Branching

- Use descriptive feature branches for active development.
- Keep release commits coherent: the functional change, required version bump, changelog/release documentation and rebuilt distributable should be committed together when they belong to the same release checkpoint.
- After a released feature branch has been merged and verified, the user may delete it locally and remotely.

## Related repositories

This repository is one part of a project family. The sibling repositories are expected next to this one:

| Repository | Local path | Role |
|---|---|---|
| `esphome-r4875g1-3phase-charger` | `../esphome-r4875g1-3phase-charger` | Charger Controller and Remote HMI firmware; defines the Home Assistant entity contract in `HomeAssistant/ENTITY_CONTRACT.md` |
| `homeassistant-r4875g1-charger` | `../homeassistant-r4875g1-charger` | Home Assistant integration; resolves Controller entities into semantic roles and exposes Backend API v1 |
| `r4875g1-charger-dashboard` | `.` | Dashboard card and Grafana history dashboard; consumes Backend API semantic roles |

### Contract surfaces

This repository has two independent upstream paths:

| Part | Binds to | Upstream source |
|---|---|---|
| Dashboard card (`src/api/`) | Backend API v1 WebSocket commands and semantic roles | `../homeassistant-r4875g1-charger/custom_components/r4875g1_charger/websocket_api.py` and `role_specs.py` |
| Grafana history dashboard (`grafana/`) | Home Assistant entity IDs in InfluxDB (`${instance}_<object_id>`), bypassing the integration | Controller entity names in `../esphome-r4875g1-3phase-charger/packages/` |

- `../esphome-r4875g1-3phase-charger/HomeAssistant/ENTITY_CONTRACT.md` is the authoritative description of the Controller entity contract.
- Controller entity IDs derive from the ESPHome `name:`. A firmware entity rename changes the Grafana measurement series even when the integration still resolves the role.

### Cross-repository rules

- A card change that needs new or changed semantic roles or Backend API fields must be implemented in the integration first. Keep `src/api/types.ts` aligned with the integration's documented Backend API v1.
- A Grafana query change must use entity object IDs that exist in the current Controller firmware. Check the firmware entity names in the same task.
- After changing semantic role references or Grafana entity IDs, run the cross-repository contract check from the firmware repository: `../esphome-r4875g1-3phase-charger/.venv/Scripts/python.exe ../esphome-r4875g1-3phase-charger/scripts/check-contract.py`. Grafana queries that use Home Assistant helper entities must be documented in `grafana/README.md` and registered in the check script.
- Each repository keeps its own versioning, changelog and validation rules. Apply the rules of the repository being changed.

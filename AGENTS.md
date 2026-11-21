# AGENTS.md

## Scope

These rules apply to the complete `r4875g1-charger-dashboard` repository.

## Inherited Rules

This repository lives in a rule hierarchy. Apply these files in addition to the rules below, in this order of increasing precedence:

| Level | File | Applies to |
|---|---|---|
| Global | `../../../../AGENTS.md` | everything: language, Git authority, branches, commits, versioning principles, documentation style, evidence |
| ESPHome | `../../../AGENTS.md` | only its "HMI Over Home Assistant" principles |

The Waveshare rules (`../../AGENTS.md`) do not apply to this repository. This file contains only what is specific to this repository and takes precedence over the inherited files.

If the inherited files are not present, for example in a fresh clone: write all repository content in English, never commit secrets, and never push, tag or publish without the user's approval.

## Translations

- Home Assistant user-facing translations must be maintained in at least English and German when translation files are introduced, and kept in sync.

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

## Local checks

- Run `npm run typecheck`, `npm run build` and `git diff --check` before committing functional frontend changes, and report the results.
- Rebuild and include `dist/r4875g1-charger-dashboard.js` whenever source changes affect the distributable bundle.

## Versioning and releases

- The version is defined in `package.json`. Keep the root package version in `package-lock.json` synchronized.
- A minor or major version is a release checkpoint: merge it to `main`, create the annotated tag `v<version>` on the release commit and publish a GitHub Release.
- Patch versions do not require a GitHub Release unless one is chosen for that change. A version that HACS should offer as an update must always be a full GitHub Release; a tag alone is not sufficient.
- Before publishing a HACS-facing release, verify that `dist/r4875g1-charger-dashboard.js` exists and matches the filename in `hacs.json`.
- Update `CHANGELOG.md` and user-facing release documentation for minor and major releases.
- Keep a release commit coherent: functional change, version bump, changelog and rebuilt bundle belong together.

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

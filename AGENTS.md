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

## Change workflow

- Work in small, reviewable functional steps.
- Before implementing a change, inspect the current branch and relevant repository rules.
- For implementation changes, provide a downloadable patch that can be checked with `git apply --check`.
- Generate patches only against the exact current target-branch files read from GitHub; never generate a user patch from synthetic, shortened or reconstructed substitute source files.
- Before delivering a patch, validate `git apply --check` against those exact target-branch file contents and confirm the target branch/commit used for validation.
- Run or request `npm run typecheck`, `npm run build` and `git diff --check` before committing functional frontend changes.
- Rebuild and include `dist/r4875g1-charger-dashboard.js` whenever source changes affect the distributable bundle.
- Do not claim runtime testing that has not actually been performed in Home Assistant.
- Treat GitHub as read-only for the assistant. The user performs commits, pushes, merges, tags, releases and branch deletion.

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
- The assistant must provide the user with all required release material, including:
  - commit message
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
- After a released feature branch has been merged and verified, it may be deleted locally and remotely.

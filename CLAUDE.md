@AGENTS.md

## Claude Code Notes

- Install dependencies with `npm ci`. Validate with `npm run typecheck`, `npm run build` and `git diff --check`.
- `npm run build` rewrites `dist/r4875g1-charger-dashboard.js`. Commit the rebuilt bundle only together with the source change that requires it.
- The sibling repositories listed in `AGENTS.md` are separate Git repositories with their own rules.

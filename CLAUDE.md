@AGENTS.md

## Claude Code Notes

- The development machine runs Windows. Prefer PowerShell for repository commands.
- Install dependencies with `npm ci`. Validate with `npm run typecheck`, `npm run build` and `git diff --check`.
- `npm run build` rewrites `dist/r4875g1-charger-dashboard.js`. Commit the rebuilt bundle only together with the source change that requires it.
- Edit files directly in the working tree. Create local branches and commits only when the user asks for them.
- Never push, merge into `main`, tag or publish a GitHub Release. The user does these steps.
- Commits made by Claude Code may end with a `Co-Authored-By` trailer.
- The sibling repositories listed in `AGENTS.md` are separate Git repositories with their own rules.

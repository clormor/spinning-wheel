# Project Learnings

### [2026-05-19] npm audit fix --force corrupts package-lock.json

**Context**: Debugging npm install failures where react-scripts appeared in node_modules but its binary was missing. Claude was troubleshooting Node 24 / npm 11 version incompatibility.
**Correction**: User identified that a prior `npm audit fix --force` had corrupted package-lock.json, stripping ~1400 packages down to 56. Claude had not asked about recent npm commands.
**Rule**: When `npm install` reports "up to date" but far fewer packages than expected are audited, and binaries are missing from node_modules, ask about recent npm commands (especially `npm audit fix --force`) before assuming a Node/npm version issue. Fix by running `git restore package-lock.json`.
**Applies to**: global

### [2026-05-19] Trust user-stated repo state without re-verifying

**Context**: User said "I'm on main and have merged all previous changes." Claude responded by running bash commands to inspect git state anyway.
**Correction**: User pointed out this was unnecessary and signalled distrust.
**Rule**: When the user directly states their current git or repo state, take it at face value and proceed. Only investigate state when it is genuinely unknown or contradicts observable evidence.
**Applies to**: global

### [2026-05-19] Clarify "preview" ambiguity before diagnosing in projects with both Vite and Vercel

**Context**: User said "vite previews don't seem to load this app properly". Claude started diagnosing a local `vite preview` base-path issue (suggesting `--base /` or visiting `/spinning-wheel/`).
**Correction**: User corrected to "vercel previews" — the problem was Vercel deployments, not the local Vite preview server. The fix was a `vercel.json` env var, not a CLI flag.
**Rule**: When a user mentions "preview" in a project with both Vite and Vercel, confirm which they mean before proposing a solution. The word is ambiguous: Vite has `npm run preview`, Vercel has preview deployments.
**Applies to**: global

### [2026-05-19] Prefer ecosystem migration over incremental audit patching for unmaintained toolchains

**Context**: User asked how to fix npm audit vulnerabilities without breaking things. Claude began explaining which individual packages could be safely patched.
**Correction**: User redirected to migrating to Vite, which eliminated all 38 vulnerabilities in one step.
**Rule**: When the root toolchain is unmaintained (e.g. CRA / react-scripts), recommend migrating to a maintained alternative (Vite) rather than incrementally patching transitive vulnerabilities. Patching react-scripts internals is a treadmill; migration is the durable fix.
**Applies to**: global

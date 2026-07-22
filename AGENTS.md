# AGENTS.md

Guidance for AI agents and LLM assistants working in this repository. This guide is model- and agent-agnostic.

## Your Role

You are a core teammate. Your goal is to improve the product, elevate code quality, and help the team execute efficiently.

- **Be candid:** Do not flatter. Challenge ideas if you see a better alternative.
- **Think beyond code:** Consider architecture, UX, and product impact, not just the implementation.
- **Prioritize simplicity:** Lean toward maintainable, readable solutions over clever or complex ones.

## Working Principles

- **Ask for clarification:** If a requirement or issue description is ambiguous, stop and ask before writing code.
- **Keep scope focused:** Solve one specific problem per branch/PR rather than bundling unrelated fixes.
- **Write clean code and tests:** Write explicit, self-documenting code and accompany logic changes with corresponding tests.
- **No hidden magic:** Avoid clever tricks, undocumented abstractions, or surprising side effects.
- **No new dependencies without approval:** Do not introduce third-party libraries or packages unless explicitly authorized. Use the existing ecosystem first.
- **Comment the _why_, not the _what_:** Avoid redundant, self-explanatory comments.
- **Comment only if necessary:** Do not write comments unless it is really required as the code is not understandable otherwise.
- **Keep output focused:** No fluff, long introductions, or repetitive apologies — focus on the technical output.

## Repository Structure & Stack

This is a monorepo:

- **`/api` — .NET backend:** ASP.NET Core API targeting .NET 10.
  - Solution projects: `Engraved.Api` (web layer), `Engraved.Core` (domain logic), `Engraved.Persistence.Mongo` (MongoDB persistence), plus matching `*.Tests` projects (NUnit).
  - Authentication: JWT with Google Auth integration.
- **`/app` — React frontend:** TypeScript, React 19, built with Vite 8.
  - Routing: TanStack Router. Server state: TanStack Query. UI: Material UI (MUI). Rich text editing: Tiptap. Charts: Chart.js. Unit tests: Vitest.
- **`/tests` — end-to-end tests:** Playwright tests that run against a locally served app and API.

## Verification

Run the relevant suites before declaring a task complete.

**Root** — formatting, linting, unused-code detection (enforced by pre-commit hooks and CI):

```sh
npm run prettier:fix
npm run lint:fix
npm run knip
```

**Backend** — from `/api`:

```sh
dotnet build
dotnet test
```

**Frontend** — from `/app`:

```sh
npm run types:check
npx vitest run
npm run build
```

Note: `npm run test` starts Vitest in watch mode in interactive terminals; use `npx vitest run` for a single pass.

**End-to-end** — from `/tests`; requires the API and app running locally (three processes). CI runs these on every PR; run them locally only when your change affects e2e-covered behavior:

```sh
npm run e2e:start-api   # terminal 1
npm run e2e:start-app   # terminal 2
npm run e2e:run-tests   # terminal 3
```

## Branches, Commits & Pull Requests

- **Branching:** Create a fresh branch off `main` with a short, descriptive kebab-case name (e.g. `fix-timer-duration`). Use a `try/` prefix for experiments.
- **Commits:** Write clear, imperative messages describing what changed and why, and reference related issues where applicable (e.g. `Fix negative timer duration formatting for #2826`). This repo does not use conventional-commit prefixes.
- **PR description:** Include:
  - A concise summary of the problem solved.
  - A brief synthesis of the discussion/decisions that led to this implementation.
  - Any technical trade-offs made or lessons learned.
  - A reference to the related Github issue (if there is one).
- Please also make sure that after every commit the PR description is updated accordingly

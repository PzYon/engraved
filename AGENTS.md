# AGENTS.md

Guidance for AI agents and LLM assistants working in this repository. This guide is model- and agent-agnostic.

## Your Role

You are a core teammate. Your goal is to improve the product, elevate code quality, and help the team execute efficiently.

- **Be candid:** Do not flatter. Challenge ideas if you see a better alternative.
- **Think beyond code:** Consider architecture, UX, and product impact, not just the implementation.
- **Prioritize simplicity:** Lean toward maintainable, readable solutions over clever or complex ones.
- **Be concise and direct**: Keep responses concise and direct; assume an audience of senior software engineers and skip basic explanations unless requested.

## Working Principles

- **Ask for clarification:** If a requirement or issue description is ambiguous, stop and ask before writing code.
- **Keep scope focused:** Solve one specific problem per branch/PR rather than bundling unrelated fixes.
- **Write clean code and tests:** Write explicit, self-documenting code and accompany logic changes with corresponding tests.
- **No hidden magic:** Avoid clever tricks, undocumented abstractions, or surprising side effects.
- **No new dependencies without approval:** Do not introduce third-party libraries or packages unless explicitly authorized. Use the existing ecosystem first.
- **Comment sparingly, and the _why_ not the _what_:** Only comment when the code is not understandable otherwise; avoid redundant, self-explanatory comments.
- **Keep output focused:** No fluff, long introductions, or repetitive apologies — focus on the technical output.
- **Ask before introducing new concepts**: Before introducing new concepts, please ensure they align with the project's goals and discuss with the team to avoid unnecessary complexity.

## Repository Structure & Stack

See the [README](README.md) for what the app is, the architecture, prerequisites, local configuration and how to run everything. Points that matter specifically when changing code:

- NuGet package versions are managed centrally in `api/Directory.Packages.props`; `PackageReference` entries in `.csproj` files carry no `Version`.
- File storage: uploaded files live in blob storage, not the database, and the API only ever hands out short-lived SAS URLs. Locally this points at Azurite, which needs to be running only when working on file features. The API creates the container and its CORS rules on startup when pointed at Azurite, so there is nothing to set up by hand. Uploads tag themselves `state=pending` and are flipped to `committed` when the entry owning them is saved, so that a lifecycle rule on the real storage account can delete the ones a cancelled edit left behind. Azurite has no lifecycle management, so locally those simply accumulate.
- npm workspaces: `app` and `tests` share one root `package-lock.json`. Install once from the root (`npm ci`); add a dependency to a workspace with `npm install <pkg> --workspace app`. Use npm 11 or newer (bundled with Node 24): npm 10 crashes while resolving this dependency tree.

## Verification

Run the relevant suites before declaring a task complete.

**Root** — formatting, linting, unused-code detection (enforced by pre-commit hooks and CI):

```sh
npm run prettier:fix
npm run lint:fix
npm run fallow
dotnet csharpier format api
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

**End-to-end** — from `/tests`; requires MongoDB on `localhost:27017`. Playwright starts the API and app itself, or reuses them if already running (`npm run e2e:start-api`, `npm run e2e:start-app`). CI runs these on every PR; run them locally only when your change affects e2e-covered behavior:

```sh
npm run e2e:run-tests
```

## Branches, Commits & Pull Requests

- **Branching:** Create a fresh branch off `main` with a short, descriptive kebab-case name (e.g. `fix-timer-duration`). Use a `try/` prefix for experiments.
- **Commits:** Write clear, imperative messages describing what changed and why, and reference related issues where applicable (e.g. `Fix negative timer duration formatting for #2826`). This repo does not use conventional-commit prefixes.
- **PR description:** Include:
  - A concise summary of the problem solved.
  - A brief synthesis of the discussion/decisions that led to this implementation.
  - Any technical trade-offs made or lessons learned.
  - A reference to the related GitHub issue (if there is one).
- Please also make sure that after every commit the PR description is updated accordingly.
- After a PR is created, please watch CI to make sure it passes. If it fails, please investigate and fix the issue.

[![CI/CD Pipeline](https://github.com/PzYon/engraved/actions/workflows/main.yml/badge.svg)](https://github.com/PzYon/engraved/actions/workflows/main.yml)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# engraved.

Track what you want. Remember what you must. All Engraved in one place.

engraved is a personal tracking app, installable as a PWA. You keep _journals_ and add _entries_ to them:

- **Counter**, **Gauge** and **Timer** journals track numbers and durations and chart them over time.
- **Scraps** journals hold notes and lists in rich text, with attached files.
- **Log Book** journals hold dated notes, optionally started from a template.

Entries can be tagged with attributes, searched, scheduled with reminders (push notifications) and shared with other users. Sign-in is via Google.

## Architecture

| Folder   | What                                                  | Stack                                                                                |
| -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `/api`   | REST API (`/api/...`)                                 | ASP.NET Core on .NET 10, MongoDB, Azure Blob Storage, NUnit                          |
| `/app`   | Single-page app and PWA                               | React 19, TypeScript, Vite, TanStack Router and Query, MUI, Tiptap, Chart.js, Vitest |
| `/tests` | End-to-end tests against a locally served app and API | Playwright                                                                           |

The API is split into these projects:

- `Engraved.Api` — web layer: controllers, authentication, startup and configuration.
- `Engraved.Core` — domain model and application logic (queries, commands, jobs), free of infrastructure.
- `Engraved.Persistence.Mongo` — MongoDB repositories.
- `Engraved.Storage.Azure` — file bytes in Azure Blob Storage, handed out only as short-lived SAS URLs.
- `Engraved.Notifications.OneSignal` — push notifications through OneSignal.
- `Engraved.TestUtils` — test helpers shared by the `*.Tests` projects.

Authentication: the app gets a Google ID token, the API validates it and issues its own JWT access and refresh tokens.

In production the app is hosted on Azure Static Web Apps and the API on Azure App Service, deployed by GitHub Actions on every push to `main` (`.github/workflows/main.yml`).

## Prerequisites

- [.NET SDK 10](https://dotnet.microsoft.com/download) (exact version in `api/global.json`)
- [Node.js 24](https://nodejs.org/) with npm 11 or newer
- [MongoDB](https://www.mongodb.com/try/download/community) on `localhost:27017`, e.g. `docker run -d -p 27017:27017 mongo`
- Optional, only when working on file uploads: [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite), started with `npm run storage:start` from `/app` (no separate install needed)

Install the npm dependencies once from the repository root (`app` and `tests` are npm workspaces sharing one lockfile):

```sh
npm ci
```

The API runs on `https://localhost:7072`, so trust the .NET development certificate once:

```sh
dotnet dev-certs https --trust
```

## Configuration

The API reads secrets from `api/Engraved.Api/appsettings.Development.json`, which is gitignored. Create it with:

```json
{
  "ConnectionStrings": {
    "engraved_db": "mongodb://localhost:27017"
  },
  "Authentication": {
    "GoogleClientId": "<Google OAuth client ID>",
    "JwtSecret": "<random string, at least 32 characters>"
  }
}
```

| Key                                   | Required | Notes                                                                                                                                       |
| ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ConnectionStrings:engraved_db`       | yes      | MongoDB connection string. The database is always named `metrix_test`.                                                                      |
| `Authentication:JwtSecret`            | yes      | Signs the API's access tokens and file ids. HMAC-SHA256, so at least 32 characters.                                                         |
| `Authentication:GoogleClientId`       | yes      | Needed to sign in. Must be the same client ID the app uses (`app/src/env/envSettings.ts`).                                                  |
| `FileStorage:ConnectionString`        | no       | Defaults to Azurite in development. In Azure, set `FileStorage:BlobEndpoint` instead to use the managed identity; setting both is rejected. |
| `Notifications:OneSignal:AppId`       | no       | OneSignal app for push notifications. The app's matching ID is `VITE_NOTIFICATIONS_APP_ID` in `app/.env.development`.                       |
| `Notifications:OneSignal:AppSecret`   | no       | OneSignal REST API key.                                                                                                                     |
| `Notifications:Job:Mode`              | no       | `Disabled` (default), `DryRun` or `Full`: whether the API sends scheduled reminders.                                                        |
| `Notifications:Job:IntervalInMinutes` | no       | How often the reminder job runs. `0` disables it.                                                                                           |

Non-secret defaults (token issuer and lifetimes, blob container name) are in the checked-in `appsettings.json`. In Azure, the same keys are set as App Service configuration, with `__` in place of `:` (e.g. `Authentication__JwtSecret`).

The app needs no local configuration: `app/.env.development` points it at `https://localhost:7072/api`.

## Running locally

API, from the repository root:

```sh
dotnet run --project api/Engraved.Api
```

App, from `/app` (served on `http://localhost:3000`):

```sh
npm start
```

## Tests and checks

Formatting, linting and unused-code detection, from the repository root (also run by the pre-commit hook and CI):

```sh
npm run prettier:check
npm run lint
npm run knip
```

API, from `/api`:

```sh
dotnet test
```

The integration tests start their own throwaway MongoDB through EphemeralMongo, so no running database is needed.

App, from `/app`:

```sh
npm run types:check
npx vitest run
npm run build
```

End-to-end, from `/tests`. Needs MongoDB running; the API uses a separate `engraved_e2e_tests` database and signs users in without Google. Playwright builds and starts the app and API itself, or reuses them if they are already running (`npm run e2e:start-api` and `npm run e2e:start-app`):

```sh
npx playwright install chromium   # once
npm run e2e:run-tests
npm run e2e:run-tests:ui:chromium # interactive
```

## Contributing

See [`AGENTS.md`](AGENTS.md) for conventions on branches, commits and pull requests. It is written for AI agents but applies to everyone.

## URLs

- Renovate job runs: https://app.renovatebot.com/dashboard#github/PzYon/engraved/

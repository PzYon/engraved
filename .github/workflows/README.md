# GitHub Actions CI/CD Pipeline

This repository uses a modular GitHub Actions workflow structure to build, test, and deploy the application.

## Workflow Files

### Main Orchestrator
- **`main.yml`** - The main CI/CD pipeline that orchestrates all other workflows
  - Detects which parts of the codebase changed (API, App, Tests)
  - Triggers parallel builds for API and App
  - Runs E2E tests after both builds complete
  - Deploys only changed components to production

### Build Workflows (Reusable)
- **`build-api.yml`** - Builds and tests the .NET API
  - Runs unit tests with coverage
  - Publishes the API artifact
  - Can be called from other workflows or run manually

- **`build-app.yml`** - Builds and tests the React/Vite app
  - Runs linting, type checking, and unit tests
  - Builds the production bundle
  - Publishes the app artifact
  - Can be called from other workflows or run manually

### Test Workflow (Reusable)
- **`e2e-tests.yml`** - Runs Playwright E2E tests
  - Downloads API and App artifacts
  - Starts both servers (API on port 5000, App on port 3000)
  - Runs Playwright tests
  - Uploads test reports and results on failure
  - Can be called from other workflows or run manually

### Deployment Workflow (Reusable)
- **`deploy.yml`** - Deploys the application
  - Accepts inputs to selectively deploy API and/or App
  - Deploys App to Azure Static Web Apps
  - Deploys API to Azure App Service (both Windows and Linux)
  - Can be called from other workflows or run manually

### Legacy Workflows
- **`app.yml`** (Legacy) - Redirects to main.yml for backward compatibility
- **`api.yml`** (Legacy) - Redirects to main.yml for backward compatibility

## Workflow Execution Flow

```
┌─────────────────┐
│   main.yml      │
│ (Orchestrator)  │
└────────┬────────┘
         │
         ├──────────────────────────┐
         │                          │
         ▼                          ▼
┌────────────────┐        ┌────────────────┐
│  build-api.yml │        │  build-app.yml │
│   (parallel)   │        │   (parallel)   │
└────────┬───────┘        └────────┬───────┘
         │                         │
         └────────┬────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ e2e-tests.yml  │
         │ (sequential)   │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │   deploy.yml   │
         │ (conditional)  │
         └────────────────┘
```

## How It Works

### 1. Change Detection
When code is pushed to the repository, the main workflow:
- Detects which directories changed (api/, app/, tests/)
- Only triggers builds for components that changed
- Workflow file changes also trigger related builds

### 2. Parallel Builds
- API and App build in parallel to save time
- Each produces an artifact that's uploaded to GitHub
- Artifacts are available for subsequent jobs

### 3. E2E Tests
- After both builds complete successfully
- Downloads both artifacts
- Starts servers using the built artifacts (not rebuilding)
- Runs Playwright tests against the running servers

### 4. Conditional Deployment
- Only runs if E2E tests pass
- Only deploys on main branch (or with force-deploy flag)
- Only deploys components that had changes
  - If only API changed → only API deploys
  - If only App changed → only App deploys
  - If both changed → both deploy

## Running Workflows Manually

All workflows can be triggered manually from the GitHub Actions UI:

### Build Only
1. Go to Actions → Build API or Build App
2. Click "Run workflow"
3. Select branch and run

### Run E2E Tests
1. First run Build API and Build App manually
2. Then go to Actions → E2E Tests
3. Click "Run workflow"

### Force Deploy
1. Go to Actions → CI/CD Pipeline
2. Click "Run workflow"
3. Check "Force deployment" if not on main branch
4. Run the workflow

## Triggers

### Automatic Triggers (main.yml)
- Push to `main` branch with changes to:
  - `app/**`
  - `api/**`
  - `tests/**`
  - `.github/workflows/**`
- Pull requests to `main` branch

### Manual Triggers
- All workflows support `workflow_dispatch` for manual execution
- Legacy workflows redirect to main.yml

## Environment Variables and Secrets

### Required Secrets
- `AZURE_STATIC_WEB_APPS_API_TOKEN_JOLLY_HILL_0967E3203` - For App deployment
- `AZUREAPPSERVICE_PUBLISHPROFILE_CF17B8AFBCD14051B9CD5C069F5E294E` - For API (Windows)
- `AZUREAPPSERVICE_PUBLISHPROFILE_CF17B8AFBCD14051B9CD5C069F5E294E_LNX` - For API (Linux)
- `APP_INSIGHTS_CONNECTING_STRING` - For application insights

### Build Variables
- `VITE_COMMIT_HASH` - Git commit SHA
- `VITE_VERSION` - GitHub run number
- `VITE_MERGE_DATE_TIME` - Build timestamp

## Benefits of This Structure

1. **No Redundancy** - Builds happen once, artifacts are reused
2. **Faster Execution** - Parallel builds save time
3. **Modular** - Each workflow can be tested and run independently
4. **Conditional Deployment** - Only deploy what changed
5. **Reusable** - Workflows can be called from other workflows
6. **Clear Flow** - Easy to understand and debug

## Migrating from Legacy Workflows

The old `app.yml` and `api.yml` workflows are now legacy. They will trigger the new `main.yml` workflow for backward compatibility. You can safely delete them if you're sure they're not being used by external processes.


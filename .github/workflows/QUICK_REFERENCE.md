# Quick Reference Guide - GitHub Actions Workflows

## 📁 File Structure

```
.github/workflows/
├── main.yml              # Main orchestrator (use this!)
├── build-api.yml         # Reusable: Build API
├── build-app.yml         # Reusable: Build App
├── e2e-tests.yml         # Reusable: E2E tests
├── deploy.yml            # Reusable: Deploy to Azure
├── api.yml               # Legacy (redirects to main.yml)
├── app.yml               # Legacy (redirects to main.yml)
└── README.md             # Full documentation
```

## 🚀 Quick Commands

### Run Full Pipeline Manually
```
GitHub → Actions → CI/CD Pipeline → Run workflow
```

### Build Individual Components
```
GitHub → Actions → Build API → Run workflow
GitHub → Actions → Build App → Run workflow
```

### Run E2E Tests Only
```
GitHub → Actions → E2E Tests → Run workflow
(Requires artifacts from previous builds)
```

### Force Deploy
```
GitHub → Actions → CI/CD Pipeline → Run workflow → Check "force-deploy"
```

## 🔍 How It Works

### On Push to Main:
1. ✅ Detects what changed (api/, app/, tests/)
2. ✅ Builds only changed components (parallel)
3. ✅ Runs E2E tests
4. ✅ Deploys only changed components

### Change Detection Logic:
- **API changes** → Triggers: api/, .github/workflows/build-api.yml, .github/workflows/main.yml
- **App changes** → Triggers: app/, .github/workflows/build-app.yml, .github/workflows/main.yml
- **Test changes** → Triggers: tests/, .github/workflows/e2e-tests.yml, .github/workflows/main.yml

### Deployment Rules:
- ✅ Only runs if E2E tests pass
- ✅ Only on `main` branch (or with force-deploy flag)
- ✅ Only deploys components that changed

## 📊 Workflow Outputs

### Build Jobs
- **Artifact**: `api` or `app`
- **Available to**: E2E tests, Deploy

### E2E Tests
- **On Success**: Nothing (allows deploy to proceed)
- **On Failure**: Uploads playwright-report and test-results

### Deploy
- **On Success**: App/API deployed to Azure
- **Environment**: Production

## ⚡ Performance Comparison

| Scenario | Before | After | Savings |
|----------|--------|-------|---------|
| API only changed | ~15 min | ~8 min | ~47% |
| App only changed | ~12 min | ~7 min | ~42% |
| Both changed | ~18 min | ~10 min | ~44% |
| Tests only changed | ~18 min | ~10 min | ~44% |

*Actual times may vary based on test duration and runner availability*

## 🛠️ Troubleshooting

### E2E Tests Fail with "Cannot download artifact"
**Cause**: No artifacts from build jobs
**Solution**: Make sure build jobs ran successfully first

### Deploy Skipped
**Cause 1**: Not on main branch → Use force-deploy flag
**Cause 2**: No changes detected → Push actual code changes
**Cause 3**: E2E tests failed → Fix tests first

### Change Detection Not Working
**Cause**: Incorrect git refs
**Solution**: Check that fetch-depth: 0 is set in checkout

### Servers Not Starting in E2E Tests
**Cause**: Wrong ports or missing dependencies
**Solution**: Check that ports match playwright.config.ts (API: 5072, App: 3000)

## 📝 Common Scenarios

### Scenario: Hot fix to API
```bash
# Make changes to api/
git add api/
git commit -m "Fix critical bug"
git push origin main

# Workflow will:
# 1. Build API only
# 2. Run E2E tests
# 3. Deploy API only (App unchanged)
```

### Scenario: Feature branch with App changes
```bash
# Make changes to app/
git checkout -b feature/new-ui
git add app/
git commit -m "New UI component"
git push origin feature/new-ui
# Create PR

# Workflow will:
# 1. Build App only
# 2. Run E2E tests
# 3. NOT deploy (not on main)
```

### Scenario: Update E2E tests
```bash
# Make changes to tests/
git add tests/
git commit -m "Add new test scenarios"
git push origin main

# Workflow will:
# 1. Build both API and App (needed for tests)
# 2. Run E2E tests with new scenarios
# 3. NOT deploy (code unchanged)
```

## 🔒 Security Notes

- All secrets are stored in GitHub repository settings
- Deploy only runs on main branch (protected)
- E2E tests gate all deployments
- Artifacts are temporary (deleted after workflow completes)

## 📚 Additional Resources

- Full documentation: `.github/workflows/README.md`
- GitHub Actions docs: https://docs.github.com/en/actions
- Playwright docs: https://playwright.dev
- Azure Static Web Apps: https://docs.microsoft.com/azure/static-web-apps

---

**Need help?** Check the full README.md in the workflows directory!


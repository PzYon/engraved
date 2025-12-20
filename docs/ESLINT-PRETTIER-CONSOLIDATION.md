# ESLint and Prettier Consolidation

**Date**: December 20, 2025  
**Summary**: Consolidated ESLint and Prettier configurations from multiple subdirectories into a single root-level configuration following monorepo best practices.

---

## Overview

Previously, the project had separate ESLint and Prettier configurations in both the `app/` and `tests/` subdirectories. This resulted in:

- Duplicate dependencies across multiple `package.json` files
- Inconsistent linting/formatting rules
- More complex maintenance
- Larger overall dependency footprint

Following best practices for monorepo setups, all configurations have been consolidated at the root level with folder-specific rule scoping.

---

## Changes Made

### 1. ESLint Consolidation

#### Created Root Configuration

- **File**: `eslint.config.mjs` (root level)
- **Structure**:
  - Base configuration for all files (ESLint recommended + TypeScript)
  - App-specific rules (React, React Hooks, TanStack Query) scoped to `app/**/*.{js,jsx,ts,tsx}`
  - Tests-specific rules (Playwright) scoped to `tests/**/*.{js,ts}`

#### Key Features

- **File-scoped rules**: Prevents rule conflicts (e.g., Playwright rules won't affect React code)
- **Shared base config**: Common rules applied across the entire project
- **Ignore patterns**: Excludes build artifacts, test reports, and generated files

#### Updated Root `package.json`

**Added scripts**:

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

**Added dependencies**:

- `@eslint/eslintrc@3.3.3`
- `@eslint/js@9.39.2`
- `@tanstack/eslint-plugin-query@5.91.2`
- `@typescript-eslint/eslint-plugin@8.50.0`
- `@typescript-eslint/parser@8.50.0`
- `eslint@9.39.2`
- `eslint-plugin-playwright@2.4.0`
- `eslint-plugin-react@7.37.5`
- `eslint-plugin-react-hooks@7.0.1`
- `eslint-plugin-react-refresh@0.4.26`
- `globals@16.5.0`

#### Cleaned Up Subdirectories

**`app/package.json`**:

- ✅ Removed all ESLint dependencies
- ✅ Removed `lint` and `lint:fix` scripts

**`tests/package.json`**:

- ✅ Removed all ESLint dependencies
- ✅ Removed all supporting ESLint packages (`@eslint/eslintrc`, `@eslint/js`, `globals`)
- ✅ Removed `lint` and `lint:fix` scripts

**Deleted files**:

- `app/eslint.config.mjs`
- `tests/eslint.config.mjs`

---

### 2. Prettier Consolidation

_(Already completed before ESLint consolidation)_

#### Root Configuration

- **File**: `.prettierrc` (root level)
- Prettier dependencies and scripts consolidated to root `package.json`

**Root scripts**:

```json
"prettier:check": "prettier --check \"**/*.{js,jsx,ts,tsx,css,scss,md,json}\"",
"prettier:fix": "prettier --write \"**/*.{js,jsx,ts,tsx,css,scss,md,json}\""
```

#### Cleaned Up Subdirectories

**`tests/package.json`**:

- ✅ Removed `prettier@3.7.4` dependency

---

## Configuration Details

### ESLint Configuration Structure

```javascript
export default [
  // 1. Ignore patterns (node_modules, dist, build artifacts, test reports)
  // 2. Base configuration for all files
  //    - ESLint recommended rules
  //    - TypeScript parser and plugin
  // 3. TypeScript recommended rules (scoped to **/*.{ts,tsx})
  // 4. App-specific React rules (scoped to app/**/*.{js,jsx,ts,tsx})
  //    - React, React Hooks, React Refresh
  //    - TanStack Query
  //    - JSX support
  // 5. Tests-specific Playwright rules (scoped to tests/**/*.{js,ts})
  //    - Playwright plugin
  //    - Browser globals
];
```

### Folder-Specific Rules

| Folder     | Rules Applied            | Key Plugins                                                              |
| ---------- | ------------------------ | ------------------------------------------------------------------------ |
| `app/`     | React, TypeScript        | `react`, `react-hooks`, `react-refresh`, `@tanstack/eslint-plugin-query` |
| `tests/`   | Playwright, TypeScript   | `playwright`                                                             |
| Root files | Base ESLint + TypeScript | `@typescript-eslint`                                                     |

---

## Benefits

### Single Source of Truth

- One ESLint configuration for the entire project
- One Prettier configuration for the entire project
- Consistent code style and quality standards across all codebases

### Simplified Maintenance

- Update dependencies in one place
- Modify rules in one location
- Easier to ensure all code follows the same standards

### Reduced Dependency Footprint

- ESLint packages installed once instead of 3 times
- Prettier installed once instead of 2 times
- Smaller `node_modules` overall
- Faster `npm install` times

### Better CI/CD

- Single command from root: `npm run lint`
- Single command from root: `npm run prettier:check`
- Simplified pipeline configuration

### No Rule Conflicts

- File-scoped configurations prevent rule bleeding
- Playwright rules only apply to test files
- React rules only apply to app files

---

## Usage

### Running Linting

From the project root:

```bash
# Check for linting errors
npm run lint

# Automatically fix linting errors
npm run lint:fix
```

### Running Prettier

From the project root:

```bash
# Check formatting
npm run prettier:check

# Fix formatting
npm run prettier:fix
```

### Pre-commit Hooks

The existing `lint-staged` configuration in root `package.json` automatically runs both ESLint and Prettier on staged files:

```json
"lint-staged": {
  "**/*.{js,jsx,ts,tsx,css,md,json}": [
    "prettier --write",
    "eslint --fix"
  ]
}
```

---

## Migration Notes

### For Developers

1. **After pulling these changes**:

   ```bash
   # In project root
   npm install

   # In app directory
   cd app && npm install

   # In tests directory
   cd ../tests && npm install
   ```

2. **IDE Configuration**:
   - ESLint should now read from the root `eslint.config.mjs`
   - Prettier should read from the root `.prettierrc`
   - Most IDEs will automatically detect the root configuration

3. **Running Scripts**:
   - Always run `npm run lint` from the **root** directory
   - Always run `npm run prettier:check` from the **root** directory
   - Subdirectory lint scripts have been removed

### Playwright Configuration

The Playwright-specific ESLint rules (like `playwright/no-standalone-expect`) now **only** apply to files in the `tests/` directory. App test files (e.g., `*.spec.ts` in `app/`) will not be checked against Playwright rules.

---

## Troubleshooting

### ESLint Not Working in IDE

1. Restart your IDE/editor
2. Clear the ESLint cache: `npx eslint --cache-location .eslintcache .`
3. Ensure the root `eslint.config.mjs` is being detected

### Wrong Rules Being Applied

The configuration uses file patterns to scope rules. Check that:

- React rules only apply to `app/**/*.{js,jsx,ts,tsx}`
- Playwright rules only apply to `tests/**/*.{js,ts}`
- If a file is in the wrong location, move it or adjust the patterns

### Dependencies Not Found

Run `npm install` in the root directory to ensure all ESLint and Prettier packages are installed at the root level.

---

## Future Considerations

### Adding New Packages

When adding new linting or formatting related packages:

1. Install them at the **root level**: `npm install -D <package> --prefix .`
2. Update the root `eslint.config.mjs` if adding ESLint plugins
3. Do NOT install linting/formatting packages in subdirectories

### Adding New Folders

If adding a new folder to the monorepo:

1. Add folder-specific rules to `eslint.config.mjs` using the `files` property
2. Determine which rule sets apply (React, Playwright, etc.)
3. Add appropriate ignore patterns if needed

### Prettier Configuration

The Prettier configuration can be extended by modifying `.prettierrc` in the root directory. Changes will apply to all code in the monorepo.

---

## Related Files

- **Root Configuration**: `/eslint.config.mjs`
- **Root Prettier**: `/.prettierrc`
- **Root Package**: `/package.json`
- **App Package**: `/app/package.json`
- **Tests Package**: `/tests/package.json`

---

## References

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Monorepo Best Practices](https://monorepo.tools/)
- [Playwright ESLint Plugin](https://github.com/playwright-community/eslint-plugin-playwright)

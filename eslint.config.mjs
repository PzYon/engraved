import js from "@eslint/js";
import globals from "globals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import playwright from "eslint-plugin-playwright";

const appFiles = ["app/**/*.{js,jsx,ts,tsx}"];
const testFiles = ["tests/**/*.{js,ts}"];

export default [
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/bin",
      "**/obj",
      "**/playwright-report",
      "**/test-results",
    ],
  },

  // Base JavaScript rules (applies everywhere).
  js.configs.recommended,

  // TypeScript: registers the @typescript-eslint plugin + parser and applies
  // its recommended rules. This is self-contained, so no parser wiring or
  // eslintrc compatibility shim is needed.
  ...typescriptEslint.configs["flat/recommended"],

  // App: React (hooks + fast-refresh) and TanStack Query.
  {
    ...reactHooks.configs.flat.recommended,
    files: appFiles,
  },
  ...pluginQuery.configs["flat/recommended"].map((config) => ({
    ...config,
    files: appFiles,
  })),
  ...pluginRouter.configs["flat/recommended"].map((config) => ({
    ...config,
    files: appFiles,
  })),
  {
    files: appFiles,
    plugins: {
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react-refresh/only-export-components": "warn",
      "no-debugger": "off",
    },
  },

  // Tests: Playwright end-to-end tests.
  {
    ...playwright.configs["flat/recommended"],
    files: testFiles,
  },
  {
    files: testFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "playwright/expect-expect": "off",
    },
  },
];

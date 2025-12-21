import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import playwright from "eslint-plugin-playwright";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const appPath = "app/**";
const testsPath = "tests/**";

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
  js.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  ...compat.extends("plugin:@typescript-eslint/recommended").map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),
  ...compat
    .extends(
      "plugin:react/jsx-runtime",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@tanstack/eslint-plugin-query/recommended",
    )
    .map((config) => ({
      ...config,
      files: [appPath + "/*.{js,jsx,ts,tsx}"],
    })),
  {
    files: [appPath + "/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: react,
      "react-hooks": reactHooks,
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

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "warn",
      "react/prop-types": 0,
      "react/display-name": "off",
      "no-debugger": "off",
    },
  },
  ...compat.extends("plugin:playwright/recommended").map((config) => ({
    ...config,
    files: [testsPath + "/*.{js,ts}"],
  })),
  {
    files: [testsPath + "/*.{js,ts}"],
    plugins: {
      playwright: playwright,
    },

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

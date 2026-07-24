const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const playwright = require("eslint-plugin-playwright");
const promise = require("eslint-plugin-promise");

module.exports = [
  {
    ignores: [
      "node_modules/",
      "test-results/",
      "playwright-report/",
      "blob-report/",
      "playwright/.cache/",
      "playwright/.auth/",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        module: "writable",
        require: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      playwright,
      promise,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...playwright.configs["flat/recommended"].rules,
      ...promise.configs["flat/recommended"].rules,
      // Cucumber drives the tests, so expect() lives inside Given/Then step
      // callbacks rather than Playwright test() blocks.
      "playwright/no-standalone-expect": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "promise/always-return": "warn",
      "promise/no-return-wrap": "warn",
    },
  },
];

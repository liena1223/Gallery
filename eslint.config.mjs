import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin'
import html from "@html-eslint/eslint-plugin";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs, css}"],
    plugins: { js, '@stylistic': stylistic },
    extends: ["js/recommended", "stylelint-config-standard-css"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
  },
]);

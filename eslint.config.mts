import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], rules: {'vue/multi-word-component-names': 'off'}, languageOptions: { parserOptions: { parser: tseslint.parser } } },
  { ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/vite-env.d.ts'] },
]);

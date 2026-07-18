import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  eslintConfigPrettier,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-warning-comments": ["error", { terms: ["todo", "fixme"] }],
    },
  },
  globalIgnores([".next/**", "coverage/**", "nexus/**"]),
]);

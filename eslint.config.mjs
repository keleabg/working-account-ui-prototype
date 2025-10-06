import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      "react/no-unknown-property": "off",
    },
  },
  {
    ignores: [
      "node_modules",
      "dist",
      ".next",
      "**/generated/*",
      "**/sandbox-templates/**",
      "webpack/**/*.js",
      "**/app/error.tsx",
      "**/*.min.js",
      "**/coverage/**",
      "**/.cache/**",
      "**/build/**",
      "**/out/**",
    ],
  },
];

export default eslintConfig;

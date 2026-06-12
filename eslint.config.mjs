import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwindcss from "eslint-plugin-tailwindcss";
import yml from "eslint-plugin-yml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  globalIgnores([
    "**/*.d.ts",
    "eslint.config.mjs",
    "next.config.ts",
    "sitecore.cli.config.ts",
    "sitecore.config.ts",
    "package.json",
    "src/Bootstrap.tsx",
    "src/Layout.tsx",
    "src/middleware.ts",
    "src/Providers.tsx",
    "src/Scripts.tsx",
    "src/app/[[]site[]]/[[]locale[]]/[[][[]...path[]][]]/not-found.tsx",
    "src/app/[[]site[]]/[[]locale[]]/[[][[]...path[]][]]/page.tsx",
    "src/app/[[]site[]]/layout.tsx",
    "src/app/api/editing/**/*",
    "src/app/api/robots/route.ts",
    "src/app/api/sitemap/route.ts",
    "src/app/global-error.tsx",
    "src/app/layout.tsx",
    "src/app/not-found.tsx",
    "src/byoc/**",
    "src/components/content-sdk/**",
    "src/i18n/**",
    "src/lib/component-props/**",
    "src/sitecore-client.ts",
  ]),
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    extends: compat.extends(
      "plugin:prettier/recommended",
      "plugin:yml/standard"
    ),

    plugins: {
      prettier,
      "simple-import-sort": simpleImportSort,
      tailwindcss,
      yml,
    },
  },
  {
    rules: {
      curly: "warn",

      // Don't force alt for <Image/> (sourced from Sitecore media)
      "jsx-a11y/alt-text": "off",

      "jsx-quotes": ["error", "prefer-double"],
      // "@next/next/no-img-element": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/explicit-module-boundary-types": "off",

      "@typescript-eslint/ban-ts-comment": [
        2,
        {
          "ts-ignore": "allow-with-description",
          minimumDescriptionLength: 12,
        },
      ],

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]);

export default eslintConfig;

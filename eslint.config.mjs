import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

// Règles personnalisées pour ADUTI
  {
    files: ["**/*.{ts,tsx}"], // toutes les extensions TS/TSX
    rules: {
      // TypeScript strict
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      
      // Qualité du code
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],

      // Ordre et import
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        }
      ],

      // Pas d'accès direct UI → Supabase
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["../lib/supabase", "../services/*"],
              "message": "L'accès direct à Supabase/Prisma depuis UI est interdit."
            }
          ]
        }
      ],

      // Préférer Zod pour la validation
      "no-restricted-globals": [
        "error",
        {
          "name": "unsafeData",
          "message": "Toutes les données utilisateur doivent passer par Zod avant d'être utilisées."
        }
      ]
    }
  }
  
]);
export default eslintConfig;

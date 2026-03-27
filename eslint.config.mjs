import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",      // scripts de test/debug, pas du code de prod
    "prisma.config.ts",
  ]),

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScript — on avertit mais on ne bloque pas le CI sur du code existant
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      // Qualité du code — warn seulement
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],

      // Import order — warn pour permettre les imports legacy existants
      "import/order": "warn",

      // React hooks — warn (pattern courant pour les effets de montage)
      "react-hooks/exhaustive-deps": "warn",

      // Entités JSX non échappées — warn
      "react/no-unescaped-entities": "warn",

      // Désactivé : trop de faux positifs sur les patterns de l'app
      "no-restricted-imports": "off",
      "no-restricted-globals": "off",
    }
  }
]);

export default eslintConfig;

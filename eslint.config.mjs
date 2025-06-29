// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**"
    ]
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "quotes": ["error", "double"]
    }
  },
);
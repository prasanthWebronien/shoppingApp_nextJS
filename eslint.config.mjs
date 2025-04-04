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

  // Add your custom rules here
  {
    rules: {
      // Disable console warnings
      "no-console": "off",
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const':'off',
      '@typescript-eslint/no-wrapper-object-types':'off',
      // Downgrade React hooks warning to a warning instead of error
      "react-hooks/exhaustive-deps": "warn",

      // You can add more rules here
    },
  },
];

export default eslintConfig;

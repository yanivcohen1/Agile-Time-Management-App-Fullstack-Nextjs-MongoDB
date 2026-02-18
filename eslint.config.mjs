import nextConfig from "eslint-config-next";
import globals from 'globals'

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "public/**",
      "**/*.min.js",
      "**/*.map"
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];

export default eslintConfig;

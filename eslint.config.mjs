import { defineConfig } from "eslint-define-config";

export default defineConfig({
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error"],
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": ["error", { "endOfLine": "auto" }]
  }
});

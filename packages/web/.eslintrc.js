module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:storybook/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jest",
    "unused-imports",
    "storybook",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: "./*.js",
      env: {
        browser: false,
        node: true,
      },
    },
  ],
};

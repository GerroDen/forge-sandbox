module.exports = {
  extends: "stylelint-config-recommended",
  plugins: ["stylelint-prettier", "stylelint-scss"],
  overrides: [
    {
      files: ["*.scss", "**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    "prettier/prettier": true,
    "at-rule-no-unknown": null,
    "function-no-unknown": null,
    "scss/function-no-unknown": true,
    "scss/at-rule-no-unknown": true,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
  },
};

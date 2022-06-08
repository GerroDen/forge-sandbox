module.exports = {
  extends: "stylelint-config-recommended",
  overrides: [
    {
      files: ["**/*.tsx"],
      customSyntax: "postcss-js",
    },
  ],
  rules: {
    "no-empty-source": null,
    "declaration-empty-line-before": null,
    "no-missing-end-of-source-newline": null,
  },
};

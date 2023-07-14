const { resolve } = require("path");
const rootDir = resolve(__dirname, "..");
const srcDir = resolve(rootDir, "src");

module.exports = {
  stories: [
    resolve(__dirname, "pages/**/*.stories.mdx"),
    resolve(srcDir, "**/*.stories.@(j|t)sx"),
  ],
  staticDirs: [resolve(__dirname, "public")],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
    docsMode: true,
  },
  typescript: {
    skipBabel: true,
  },
};

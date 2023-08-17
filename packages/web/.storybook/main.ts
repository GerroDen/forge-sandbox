import { resolve } from "path";
import { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const rootDir = resolve(__dirname, "..");
const srcDir = resolve(rootDir, "src");

const config: StorybookConfig = {
  stories: [
    resolve(__dirname, "pages/**/*.stories.mdx"),
    resolve(srcDir, "**/*.stories.@(j|t)sx"),
  ],
  staticDirs: [resolve(__dirname, "public")],
  addons: [
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
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
  core: {
    enableCrashReports: true,
  },
};

export default config;

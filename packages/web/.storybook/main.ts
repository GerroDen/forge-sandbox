import { resolve } from "path";
import { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";
import { defineConfig, mergeConfig } from "vite";

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
  async viteFinal(config) {
    return mergeConfig(
      config,
      defineConfig({
        resolve: {
          alias: {
            "@": srcDir,
            "@sb": __dirname,
            bridge: "bridge/src",
            "@forge/bridge": resolve(srcDir, "__mocks__/local-forge-bridge.ts"),
          },
        },
      }),
    );
  },
  docs: {
    autodocs: true,
    docsMode: true,
  },
  core: {
    enableCrashReports: true,
  },
};

export default config;

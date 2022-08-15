import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import StylelintPlugin from "vite-plugin-stylelint";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react({
        jsxRuntime: "classic",
        exclude: /\.stories\.tsx?$/,
        include: "**/*.tsx",
      }),
      eslint(),
      StylelintPlugin(),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@assets": resolve(__dirname, "assets"),
        ...(env.LOCAL_DEV === "true" && {
          "@forge/bridge": resolve(
            __dirname,
            "src/__mocks__/local-forge-bridge.ts"
          ),
        }),
      },
    },
    base: "./",
    server: {
      port: env.LOCAL_DEV === "true" ? 3000 : 3001,
      proxy: {
        "/rest": {
          target: env.ATLASSIAN_BASE_URL,
          auth: `${env.ATLASSIAN_AUTH_EMAIL}:${env.ATLASSIAN_AUTH_TOKEN}`,
          changeOrigin: true,
        },
      },
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
  };
});

import { defineConfig, loadEnv, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import StylelintPlugin from "vite-plugin-stylelint";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const forgeContextVars = Object.fromEntries(
    Object.entries(env)
      .filter(
        ([key]) => key.startsWith("FORGE_CONTEXT_") || key.startsWith("FC_")
      )
      .map(([key, value]) => [
        key,
        value.replace("FORGE_CONTEXT_", "").replace("FC_", ""),
      ])
  );
  return {
    plugins: [
      react({
        jsxRuntime: "classic",
        exclude: /\.stories\.tsx?$/,
        include: "**/*.tsx",
      }),
      eslint() as unknown as PluginOption,
      StylelintPlugin() as unknown as PluginOption,
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@assets": resolve(__dirname, "assets"),
        bridge: "bridge/src",
        ...(env.LOCAL_DEV === "true" && {
          "@forge/bridge": resolve(
            __dirname,
            "src/__mocks__/local-forge-bridge.ts"
          ),
        }),
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.FORGE_CONTEXT": JSON.stringify(forgeContextVars),
    },
    base: "./",
    server: {
      port: env.LOCAL_DEV === "true" ? 3000 : 3001,
      proxy: {
        "/rest": {
          target: env.ATLASSIAN_BASE_URL,
          auth: `${env.ATLASSIAN_AUTH_EMAIL}:${env.ATLASSIAN_AUTH_TOKEN}`,
          changeOrigin: true,
          headers: {
            // fixes XSRF errors, cause X-Atlassian-Token header is only interpreted for non browser user-agents
            "User-Agent": "Node.js",
            // fixes XSRF errors in dev:local
            "X-Atlassian-Token": "no-check",
          },
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

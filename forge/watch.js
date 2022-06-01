#!/usr/bin/env node
import chokidar from "chokidar";
import { bundle } from "./build.js";

const paths = ["src/**/*.ts", "manifest.yml", "tsconfig.json", "package.json"];
await bundle();
console.log(`watching changes on ${paths.join(", ")}`);
chokidar.watch(paths).on("change", async () => {
  await bundle();
});

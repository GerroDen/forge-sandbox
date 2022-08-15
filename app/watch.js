#!/usr/bin/env node
import chokidar from "chokidar";
import { bundle, manifestFile } from "./build.js";

const paths = ["src/**/*.ts", manifestFile, "tsconfig.json", "package.json"];
await bundle();
console.log(`watching changes on ${paths.join(", ")}`);
chokidar.watch(paths, { ignoreInitial: true }).on("all", async () => {
  await bundle();
});

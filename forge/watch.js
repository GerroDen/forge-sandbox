#!/usr/bin/env node
import chokidar from "chokidar";
import { bundle, manifestFile, webOutDir } from "./build.js";

const paths = [
  "src/**/*.ts",
  manifestFile,
  "tsconfig.json",
  "package.json",
  `${webOutDir}/**/*`,
];
await bundle();
console.log(`watching changes on ${paths.join(", ")}`, { ignoreInitial: true });
chokidar.watch(paths).on("all", async () => {
  await bundle();
});

#!/usr/bin/env node
import chokidar from "chokidar";
import { bundle, manifestFile } from "./build.js";

const paths = ["src/**/*.ts", manifestFile, "tsconfig.json", "package.json"];
await build();
console.log(`watching changes on ${paths.join(", ")}`);
chokidar.watch(paths, { ignoreInitial: true }).on("all", build);

async function build() {
  try {
    await bundle();
  } catch (e) {
    console.error("bundling failed", e);
  }
}

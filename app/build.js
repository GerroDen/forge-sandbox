#!/usr/bin/env node
import { basename, dirname, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { build } from "esbuild";
import { copyFile, cp, mkdir, readFile, rm, writeFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootPath = resolve(__dirname);
const packagesPath = resolve(rootPath, "../packages");
const outDir = "dist";
const entryPoint = resolve(rootPath, "src/index.ts");
export const manifestFile = resolve(packagesPath, "manifest/dist/manifest.yml");
const webBundleDir = resolve(packagesPath, "web/dist");
const webOutDir = resolve(rootPath, outDir, "web");

const externalLibs = ["^@forge/"];

class TrackExternalDependencies {
  constructor() {
    this._foundExternals = new Set();
  }

  get foundExternals() {
    return [...this._foundExternals];
  }

  get plugin() {
    return {
      name: "trackExternalDependenciesPlugin",
      setup: (build) => {
        for (const external of externalLibs) {
          build.onResolve({ filter: new RegExp(external) }, (args) => {
            this._foundExternals.add(args.path);
            return { path: args.path, external: true };
          });
        }
      },
    };
  }
}

export async function bundle() {
  console.info("bundling project");
  const trackExternalDependencies = new TrackExternalDependencies();
  await Promise.all([
    mkdir(resolve(rootPath, outDir), { recursive: true }),
    build({
      entryPoints: [entryPoint],
      bundle: true,
      outdir: resolve(rootPath, outDir, "src"),
      format: "esm",
      target: "node14",
      plugins: [trackExternalDependencies.plugin],
    }),
    (async () => {
      await rm(webOutDir, { recursive: true, force: true });
      await cp(webBundleDir, webOutDir, { recursive: true });
    })(),
    copyFile(manifestFile, resolve(rootPath, outDir, basename(manifestFile))),
  ]);
  console.log(
    `Found externals: ${trackExternalDependencies.foundExternals.join(", ")}`
  );
  const basePackageJsonString = await readFile(
    resolve(rootPath, "package.json"),
    { encoding: "utf8" }
  );
  const basePackageJson = JSON.parse(basePackageJsonString);
  let dependencies = Object.fromEntries(
    trackExternalDependencies.foundExternals.map((externalLib) => [
      externalLib,
      basePackageJson.dependencies[externalLib],
    ])
  );
  const packageJson = {
    name: "forge",
    private: true,
    version: "0.0.0",
    dependencies: dependencies,
  };
  await Promise.all([
    writeFile(resolve(outDir, "package.json"), JSON.stringify(packageJson), {
      encoding: "utf8",
    }),
  ]);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await bundle();
}

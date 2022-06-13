#!/usr/bin/env node
import { basename, dirname, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { build } from "esbuild";
import { copyFile, cp, readFile, writeFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootPath = resolve(__dirname);
const outDir = "dist";
const entryPoint = resolve(rootPath, "src/index.ts");
export const manifestFile = resolve(rootPath, "../manifest/dist/manifest.yml");
export const webOutDir = resolve(rootPath, "../web/dist");

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
    await build({
      entryPoints: [entryPoint],
      bundle: true,
      outdir: resolve(rootPath, outDir, "src"),
      format: "esm",
      plugins: [trackExternalDependencies.plugin],
    }),
    await cp(webOutDir, resolve(rootPath, outDir, "web"), { recursive: true }),
    await copyFile(
      manifestFile,
      resolve(rootPath, outDir, basename(manifestFile))
    ),
  ]);
  console.log(
    `Found externals: ${trackExternalDependencies.foundExternals.join(", ")}`
  );
  const basePackageJsonString = await readFile(
    resolve(rootPath, "package.json"),
    { encoding: "utf8" }
  );
  const basePackageJson = JSON.parse(basePackageJsonString);
  const packageJson = {
    name: "forge",
    private: true,
    version: "0.0.0",
    dependencies: Object.fromEntries(
      trackExternalDependencies.foundExternals.map((externalLib) => [
        externalLib,
        basePackageJson.dependencies[externalLib],
      ])
    ),
  };
  await writeFile(
    resolve(outDir, "package.json"),
    JSON.stringify(packageJson),
    {
      encoding: "utf8",
    }
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await bundle();
}

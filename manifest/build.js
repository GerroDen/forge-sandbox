#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { merge, set } from "lodash-es";
import YAML from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = resolve(__dirname, "template");
const outFile = resolve(__dirname, "dist/manifest.yml");

const base = await readYaml(resolve(templatePath, "base.yml"));
const dev = await readYaml(resolve(templatePath, "dev.yml"));
let manifest = merge(base, dev);
if (process.argv.length === 4) {
  manifest = set(manifest, process.argv[2], process.argv[3]);
}
await writeYaml(outFile, manifest);

async function readYaml(file) {
  const content = await readFile(file, {
    encoding: "utf8",
  });
  return YAML.parse(content);
}

async function writeYaml(file, yaml) {
  const content = YAML.stringify(yaml);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

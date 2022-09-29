#!/usr/bin/env node
import { ProcessorBuilder, ValidationTypes } from "@forge/manifest";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestFile = resolve(__dirname, "dist/manifest.yml");
const ignoredMessages = [
  /^missing directory/,
  /^missing index\.html file/,
  /cannot find associated file with name 'index\.\[jt]\(s|sx\)'$/,
];

const results = await ProcessorBuilder.instance()
  .withValidation(ValidationTypes.FULL)
  .build()
  .process(manifestFile);

const errors = results.errors.filter(
  ({ message }) =>
    !ignoredMessages.some((ignoreRegex) => ignoreRegex.test(message))
);
if (errors.length > 0) {
  console.error("Manifest has errors");
  for (let error of errors) {
    console.error(
      `${manifestFile}:${error.line}:${error.column}: ${error.message}`
    );
    if (process.env.DEBUG === "1") {
      console.error(`${JSON.stringify(error)}`);
    }
  }
  process.exit(1);
}

console.info(`Manifest is valid`);

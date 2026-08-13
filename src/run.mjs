import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// eslint-disable-next-line n/no-missing-import -- provided by VS Code
import * as vscode from "vscode";
import { normalizeSchema } from "./normalize-schema.js";
import { URI_LIST } from "./uri-list.js";
import { RESOURCES_PATH_ROOT } from "./const.js";
import { updateMetadata } from "./meta.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export { run };

async function run() {
  // Wait for VSCode initialization to stabilize.
  await new Promise((resolve) => setTimeout(resolve, 120000));
  const processedUri = new Set();
  const buffer = [...URI_LIST];
  let uri;
  while ((uri = buffer.shift())) {
    if (processedUri.has(uri)) {
      continue;
    }
    processedUri.add(uri);
    console.log(`Extract:${JSON.stringify(uri)}`);
    const json = await openByVSCode(uri);
    if (json == null) {
      console.log(`Ignore:${JSON.stringify(uri)}`);
      continue;
    }
    const normalizedJson = normalizeJson(json, uri);
    const resourcePath = path.join(
      RESOURCES_PATH_ROOT,
      `${uri.replaceAll("vscode:", "vscode")}.json`,
    );
    fs.mkdirSync(path.dirname(resourcePath), { recursive: true });
    fs.writeFileSync(resourcePath, normalizedJson);

    const newUriList = [...normalizedJson.matchAll(/"(vscode:\/\/[^"]+)"/g)]
      .map((m) => {
        const vscodeUri = new URL(m[1]);
        vscodeUri.hash = "";
        return vscodeUri.toString();
      })
      .filter((u) => !processedUri.has(u) && !buffer.includes(u));
    if (newUriList.length) {
      console.log(newUriList);
      buffer.push(...newUriList);
    }
  }

  updateREADME(processedUri);
  updateMetadata(vscode.version);
}

async function openByVSCode(uri) {
  try {
    return (
      await vscode.workspace.openTextDocument(vscode.Uri.parse(uri))
    ).getText();
  } catch (error) {
    console.warn(error);
  }
  return null;
}

function normalizeJson(json, uri) {
  const object = JSON.parse(json);

  if (uri.startsWith("vscode://schemas/")) {
    normalizeSchema(object);
  }

  return `${JSON.stringify(object, null, 2)}\n`;
}

function updateREADME(processedUri) {
  const readmePath = path.join(currentDir, "..", "README.md");
  const readme = fs.readFileSync(readmePath, "utf8");

  fs.writeFileSync(
    readmePath,
    readme.replace(
      /<!--EXTRACT-INFO-START-->([\s\S]*?)<!--EXTRACT-INFO-END-->/u,
      `<!--EXTRACT-INFO-START-->

Version of VSCode used for extraction: ${vscode.version}

Extracted Resources:

| URI | GitHub URL |
| --- | ---------- |
${[...processedUri]
  .sort()
  .map((uri) => {
    const path = `${uri.replaceAll("vscode:", "vscode")}.json`.replace(
      /\/\//gu,
      "/",
    );
    const rawLink = `https://github.com/ota-meshi/extract-vscode-schemas/raw/main/resources/${path}`;
    const link = `https://raw.githubusercontent.com/ota-meshi/extract-vscode-schemas/main/resources/${path}`;

    return `| \`${uri}\` | [${link}](${rawLink}) |`;
  })
  .join("\n")}

<!--EXTRACT-INFO-END-->`,
    ),
    "utf8",
  );
}

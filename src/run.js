"use strict";

const fs = require("node:fs");
const path = require("node:path");
// eslint-disable-next-line node/no-missing-require -- only type
const vscode = require("vscode");
const { URI_LIST } = require("./uri-list");

const RESOURCES_PATH_ROOT = path.join(__dirname, "..", "resources");
module.exports = { run };

async function run() {
  const processed = new Set();
  const buffer = [...URI_LIST];
  let uri;
  while ((uri = buffer.shift())) {
    if (processed.has(uri)) {
      continue;
    }
    processed.add(uri);
    console.log(`Extract:${JSON.stringify(uri)}`);
    const json = (
      await vscode.workspace.openTextDocument(vscode.Uri.parse(uri))
    ).getText();
    const resourcePath = path.join(
      RESOURCES_PATH_ROOT,
      `${uri.replaceAll("vscode:", "vscode")}.json`
    );
    fs.mkdirSync(path.dirname(resourcePath), { recursive: true });
    fs.writeFileSync(resourcePath, json);

    const newUriList = [...json.matchAll(/"(vscode:\/\/[^"]+)"/g)]
      .map((m) => {
        const vscodeUri = new URL(m[1]);
        vscodeUri.hash = "";
        return vscodeUri.toString();
      })
      .filter((u) => !processed.has(u) && !buffer.includes(u));
    if (newUriList.length) {
      console.log(newUriList);
      buffer.push(...newUriList);
    }
  }
}

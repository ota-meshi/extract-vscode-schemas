"use strict";

const { runTests, downloadAndUnzipVSCode } = require("@vscode/test-electron");
const path = require("node:path");

main();

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, ".");
    const extensionTestsPath = path.resolve(__dirname, "./run.js");
    const vscodeExecutablePath = await downloadAndUnzipVSCode("stable");

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      vscodeExecutablePath,
    });
  } catch (err) {
    console.error("Failed to run extract");
    throw err;
  }
}

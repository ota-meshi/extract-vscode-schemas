import { runTests, downloadAndUnzipVSCode } from "@vscode/test-electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

main();

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(currentDir, ".");
    const extensionTestsPath = path.resolve(currentDir, "./run.mjs");
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

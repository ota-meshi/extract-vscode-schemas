"use strict";

const { spawn } = require("node:child_process");

main();

/** Main */
async function main() {
  if (!(await checkDiff())) {
    return;
  }

  // eslint-disable-next-line no-process-env -- ignore
  const GITHUB_ACTOR = process.env.GITHUB_ACTOR;

  if (GITHUB_ACTOR) {
    await git("config", "user.name", GITHUB_ACTOR);
    await git(
      "config",
      "user.email",
      `${GITHUB_ACTOR}@users.noreply.github.com`
    );
  }
  await git("add", ".");
  await git("commit", "-m", "Update resources");
  // eslint-disable-next-line no-process-env -- ignore
  const { GITHUB_TOKEN } = process.env;
  await git(
    "push",
    `https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/ota-meshi/extract-vscode-schemas.git`,
    "main"
  );
}

async function checkDiff() {
  const { stdout } = await git("status", "--porcelain");
  return Boolean(stdout);
}

/** Git command */
function git(...args) {
  return new Promise((resolve, reject) => {
    let stdout = "";
    const cmd = spawn("git", args);
    cmd.stdout.on("data", (data) => {
      process.stdout.write(data);
      stdout += data;
    });
    cmd.stderr.pipe(process.stderr);

    cmd.on("error", (err) => reject(err));
    cmd.on("exit", (code) => {
      const exitCode = code || 0;
      if (exitCode !== 0) {
        reject(new Error(`ExitCode: ${exitCode}`));
        return;
      }
      resolve({ code: exitCode, stdout });
    });
  });
}

"use strict";

const path = require("node:path");
const fs = require("node:fs");
const {
  META_FILEPATH,
  RESOURCES_PATH_ROOT,
  OLD_META_FILEPATH,
} = require("./const");

module.exports = { getMeta, getOldMeta, updateMetadata };

function getMeta() {
  return fs.existsSync(META_FILEPATH)
    ? JSON.parse(fs.readFileSync(META_FILEPATH, "utf8"))
    : {};
}

function getOldMeta() {
  return fs.existsSync(OLD_META_FILEPATH)
    ? JSON.parse(fs.readFileSync(OLD_META_FILEPATH, "utf8"))
    : {};
}

function updateMetadata(vscodeVersion) {
  const meta = fs.existsSync(META_FILEPATH)
    ? JSON.parse(fs.readFileSync(META_FILEPATH, "utf8"))
    : {};
  meta.vscodeVersion = vscodeVersion;

  const resources = {};
  meta.resources = resources;
  for (const name of listupFiles(RESOURCES_PATH_ROOT)) {
    const uri = name
      .replace(RESOURCES_PATH_ROOT, "")
      .replace(/\.json$/, "")
      .replace(/\\/g, "/");
    const lines = fs.readFileSync(name, "utf8").split("\n").length;
    resources[uri] = {
      lines,
    };
  }

  fs.writeFileSync(META_FILEPATH, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
}

function* listupFiles(dir) {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* listupFiles(res);
    } else {
      yield res;
    }
  }
}

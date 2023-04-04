"use strict";

const path = require("node:path");

const RESOURCES_PATH_ROOT = path.join(__dirname, "..", "resources");
const META_FILEPATH = path.join(__dirname, "..", "meta-data.json");
const OLD_META_FILEPATH = path.join(__dirname, "..", "old-meta-data.json");

module.exports = {
  RESOURCES_PATH_ROOT,
  META_FILEPATH,
  OLD_META_FILEPATH,
};

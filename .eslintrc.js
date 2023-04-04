"use strict";

// const version = require("./package.json").version

module.exports = {
  parserOptions: {
    sourceType: "script",
    ecmaVersion: "latest",
  },
  ignorePatterns: [
    "resources/**/*.json",
    "meta-data.json",
    "old-meta-data.json",
  ],
  extends: [
    "plugin:@ota-meshi/recommended",
    "plugin:@ota-meshi/+node",
    "plugin:@ota-meshi/+prettier",
    "plugin:@ota-meshi/+json",
  ],
  rules: {
    "require-jsdoc": "off",
    "no-warning-comments": "warn",
    "no-shadow": "off",
  },
};

"use strict";

const otaMeshi = require("@ota-meshi/eslint-plugin");

module.exports = [
  {
    ignores: [
      "**/.*",
      "resources/**/*.json",
      "meta-data.json",
      "old-meta-data.json",
    ],
  },
  ...otaMeshi.config({
    node: true,
    prettier: true,
    json: true,
  }),
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    rules: {
      "jsdoc/require-jsdoc": "off",
      "no-warning-comments": "warn",
      "no-shadow": "off",
    },
  },
];

import otaMeshi from "@ota-meshi/eslint-plugin";

export default [
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
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "jsdoc/require-jsdoc": "off",
      "no-warning-comments": "warn",
      "no-shadow": "off",
    },
  },
];

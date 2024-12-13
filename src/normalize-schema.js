"use strict";

module.exports = { normalizeSchema };

function normalizeSchema(schema) {
  if (!schema) {
    return schema;
  }
  if (Array.isArray(schema.enum)) {
    normalizeEnum(schema);
  }
  for (const key of [
    // composition
    "anyOf",
    "allOf",
    "oneOf",
  ]) {
    if (Array.isArray(schema[key])) {
      schema[key].forEach(normalizeSchema);
      schema[key].sort(compareSchema);
    }
  }
  for (const key of [
    // if-then-else
    "if",
    "then",
    "else",
    // array
    "items",
    "contains",
    // composition
    "not",
  ]) {
    if (isPlainObject(schema[key])) {
      normalizeSchema(schema[key]);
    }
  }
  for (const key of [
    // unknown properties in json schema
    "default",
    "defaultDefaultValue",
  ]) {
    if (isPlainObject(schema[key])) {
      schema[key] = Object.fromEntries(
        Object.entries(schema[key]).sort(([a], [b]) => compare(a, b)),
      );
    }
  }

  for (const key of ["definitions", "properties"]) {
    if (isPlainObject(schema[key])) {
      const values = Object.entries(schema[key]).sort(([a], [b]) =>
        compare(a, b),
      );
      schema[key] = Object.fromEntries(
        values.map(([key, value]) => [key, normalizeSchema(value)]),
      );
    }
  }
  if (isPlainObject(schema.patternProperties)) {
    for (const property of Object.values(schema.patternProperties)) {
      normalizeSchema(property);
    }
  }
  return schema;
}

function isPlainObject(obj) {
  return obj != null && !Array.isArray(obj) && typeof obj === "object";
}

function normalizeEnum(schema) {
  if (!schema?.enum || !Array.isArray(schema.enum)) {
    return;
  }
  const enumValues = schema.enum
    .map((e, i) => [
      e,
      schema.enumDescriptions?.[i] ?? null,
      schema.markdownEnumDescriptions?.[i] ?? null,
    ])
    .filter(
      (array) =>
        !array.some(
          (e) => typeof e === "string" && e.includes("/.vscode-test/"),
        ),
    )
    .sort(([a], [b]) => compare(a, b));
  if (enumValues.length === 0) {
    delete schema.enum;
    delete schema.enumDescriptions;
    delete schema.markdownEnumDescriptions;
    if (!schema.type) {
      schema.type = "string";
    }
    return;
  }
  schema.enum = enumValues.map(([e]) => e);
  if (Array.isArray(schema.enumDescriptions)) {
    schema.enumDescriptions = [
      ...enumValues.map(([, e]) => e),
      // ...schema.enumDescriptions.slice(enumValues.length),
    ];
  }
  if (Array.isArray(schema.markdownEnumDescriptions)) {
    schema.markdownEnumDescriptions = [
      ...enumValues.map(([, , e]) => e),
      // ...schema.markdownEnumDescriptions.slice(enumValues.length),
    ];
  }
}

function compare(unknownA, unknownB) {
  const a = normalizeString(unknownA);
  const b = normalizeString(unknownB);
  const normalizeA = a.startsWith("-") ? a.slice(1) : a;
  const normalizeB = b.startsWith("-") ? b.slice(1) : b;
  return normalizeA.localeCompare(normalizeB) || b.localeCompare(a);
}

function normalizeString(s) {
  return typeof s === "string" ? s : s == null ? "" : JSON.stringify(s);
}

function compareSchema(a, b) {
  return JSON.stringify(a).localeCompare(JSON.stringify(b));
}

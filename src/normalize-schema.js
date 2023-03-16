"use strict";

module.exports = { normalizeSchema };

function normalizeSchema(schema) {
  if (!schema) {
    return schema;
  }
  if (
    Array.isArray(schema.enum) &&
    (!schema.type || schema.type === "string")
  ) {
    normalizeEnum(schema);
  } else if (Array.isArray(schema.anyOf) && !schema.type) {
    schema.anyOf.forEach(normalizeSchema);
    schema.anyOf.sort(compareSchema);
  } else if (
    schema.type === "array" ||
    (isPlainObject(schema.items) && !schema.type)
  ) {
    if (isPlainObject(schema.items)) {
      normalizeSchema(schema.items);
    }
  } else if (
    schema.type === "object" ||
    (isPlainObject(schema.properties) && !schema.type)
  ) {
    if (isPlainObject(schema.properties)) {
      const keys = Object.keys(schema.properties).sort(compare);
      schema.properties = Object.fromEntries(
        keys.map((key) => [key, normalizeSchema(schema.properties[key])])
      );
    }
  }
  return schema;
}

function isPlainObject(obj) {
  return !Array.isArray(obj) && typeof obj === "object";
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
    .filter((e) => !e.join().includes(".vscode-test/user-data/logs"))
    .sort((a, b) => compare(a[0], b[0]));
  schema.enum = enumValues.map(([e]) => e);
  if (
    Array.isArray(schema.enumDescriptions) &&
    schema.enumDescriptions.length <= schema.enum.length
  ) {
    schema.enumDescriptions = enumValues.map(([, e]) => e);
  }
  if (
    Array.isArray(schema.markdownEnumDescriptions) &&
    schema.markdownEnumDescriptions.length <= schema.enum.length
  ) {
    schema.markdownEnumDescriptions = enumValues.map(([, , e]) => e);
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

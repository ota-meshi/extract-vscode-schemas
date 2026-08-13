import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
export const RESOURCES_PATH_ROOT = path.join(currentDir, "..", "resources");
export const META_FILEPATH = path.join(currentDir, "..", "meta-data.json");
export const OLD_META_FILEPATH = path.join(
  currentDir,
  "..",
  "old-meta-data.json",
);

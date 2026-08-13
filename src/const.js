import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const RESOURCES_PATH_ROOT = path.join(currentDir, "..", "resources");
const META_FILEPATH = path.join(currentDir, "..", "meta-data.json");
const OLD_META_FILEPATH = path.join(currentDir, "..", "old-meta-data.json");

export { RESOURCES_PATH_ROOT, META_FILEPATH, OLD_META_FILEPATH };

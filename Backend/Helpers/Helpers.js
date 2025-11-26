import { fileURLToPath } from "url";
import path from "path";
import { readFileSync, writeFileSync } from "fs";

const FILE_PATH = "./DataBase/paises.json";

export class Helper {
  /**
   * Returns the directory of the Helper.js file itself.
   * Use getDirname(import.meta.url) instead for caller's directory.
   */
  static __dirname() {
    return path.dirname(fileURLToPath(import.meta.url));
  }

  /**
   * Returns the directory of the calling file.
   */
  static getDirname(importMetaUrl) {
    return path.dirname(fileURLToPath(importMetaUrl));
  }

  /**
   * Returns the full path of the calling file.
   */
  static getFilename(importMetaUrl) {
    return fileURLToPath(importMetaUrl);
  }

  /**
   * Joins multiple path segments into a single path.
   */
  static joinPath(...segments) {
    return path.join(...segments);
  }
  /**
   * Reads and parses the JSON file, returning its contents as an object.
   *
   * @returns {Object} The parsed JSON data.
   */
  static readJSON() {
    const data = readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
  }

  /**
   * Writes the given data object to the JSON file.
   *
   * @param {Object} data - The data to write to the JSON file.
   */
  static writeJSON(data) {
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  }
}

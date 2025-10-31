/**
 * @file Helper.js
 * @description Utility class providing helper methods for ES modules
 */

import { fileURLToPath } from "url";
import path from "path";

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
   * @param {string} importMetaUrl - Pass import.meta.url from your file
   * @returns {string} Absolute directory path
   */
  static getDirname(importMetaUrl) {
    return path.dirname(fileURLToPath(importMetaUrl));
  }



  /**
   * Returns the full path of the calling file.
   * @param {string} importMetaUrl - Pass import.meta.url from your file
   * @returns {string} Absolute file path
   */
  static getFilename(importMetaUrl) {
    return fileURLToPath(importMetaUrl);
  }
}
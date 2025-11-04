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
}
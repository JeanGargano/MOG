/**
 * Controller for managing survey-related operations.
 *
 * This controller handles retrieving forms from Google Apps Script,
 * migrating survey data into the database, generating Excel files,
 * clearing form data, and managing file downloads from the server.
 */

import path from "path";
import fs from "fs";
import { Helper } from "../Helpers/Helpers.js";

export class SurveyController {
  constructor(surveyService) {
    this.surveyService = surveyService;
  }

  

  /**
   * Endpoint to fetch a form from Google Apps Script.
   *
   * This method delegates the HTTP request to the service layer.
   *
   * @async
   * @function getForm
   * @param {import("express").Request} req - HTTP request containing the form ID in `req.query.id`.
   * @param {import("express").Response} res - HTTP response object.
   * @returns {Promise<void>} Returns the form data as JSON or an error message.
   */
  async get_form(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Missing form ID parameter" });
      }

      const form = await this.surveyService.get_form(id);

      if (form.error) {
        return res.status(404).json({ error: form.error });
      }

      res.status(200).json(form);
    } catch (error) {
      console.error("Error in getForm (Controller):", error);
      res.status(500).json({ error: "Failed to fetch the form" });
    }
  }



  /**
   * Migrates received survey data from the request body into the database
   * and generates an Excel file containing the stored data.
   *
   * @async
   * @function migrateData
   * @param {import("express").Request} req - HTTP request containing survey data in `req.body`.
   * @param {import("express").Response} res - HTTP response object.
   * @returns {Promise<void>} Returns a success message, migrated count, and Excel download URL.
   */
  async migrate_surveys(req, res) {
    try {
      const surveys = req && req.body;

      if (
        !surveys ||
        (Object.keys(survey).length === 0 && surveys.constructor === Object)
      ) {
        return res.status(400).json({
          error: "No survey responses were received in the request body",
        });
      }

      const result = await this.surveyService.migrate_surveys(surveys);

      if (result.error) {
        return res
          .status(Number(result.status) || 400)
          .json({ error: result.error });
      }

    } catch (error) {
      console.error("Error in SurveyController:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  }





  /**
   * Serves Excel files from the `downloads` directory and deletes them
   * after download or automatically after 15 minutes.
   *
   * @function downloadExcel
   * @param {import("express").Request} req - HTTP request that includes the `file` query parameter.
   * @param {import("express").Response} res - HTTP response object.
   * @returns {void} Initiates file download and schedules deletion.
   */
  download_excel(req, res) {
    try {
      const file = req.query.file;
      if (!file)
        return res.status(400).json({ error: "Missing 'file' parameter" });

      const downloadsPath = path.join(
        Helper.__dirname(),
        "..",
        "downloads",
      );
      const fullPath = path.join(downloadsPath, file);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "File not found" });
      }

      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
      res.download(fullPath, file, (err) => {
        if (err) {
          console.error("Error while sending file:", err);
          return res.status(500).json({ error: "Error sending file" });
        }

        // Delete file after successful download
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Could not delete file after download:", unlinkErr);
          } else {
            console.log("File deleted after download:", fullPath);
          }
        });
      });

      // Scheduled deletion after 15 minutes
      setTimeout(() => {
        if (fs.existsSync(fullPath)) {
          fs.unlink(fullPath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting file during scheduled cleanup:", unlinkErr);
            } else {
              console.log("File deleted during scheduled cleanup:", fullPath);
            }
          });
        }
      }, 1000 * 60 * 15);
    } catch (err) {
      console.error("Error in downloadExcel:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

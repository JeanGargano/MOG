import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import ExcelJS from "exceljs";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadsDir = path.join(__dirname, "..", "downloads");



/**
 * Service that manages operations related to surveys.
 * 
 * Includes functions to:
 * - Retrieve forms from Google Apps Script
 * - Migrate surveys from request body to database
 * - Export surveys to Excel format (.xlsx) dynamically
 */
export class SurveyService {
  constructor(surveyRepository) {
    this.surveyRepository = surveyRepository;
  }

  /**
   * Retrieves a form from the Google Apps Script endpoint and returns the JSON.
   * 
   * @async
   * @param {string} id - Google Form ID to retrieve
   * @returns {Promise<Object>} Returns the form data or error object
   * @throws {Error} If the 'id' parameter is not provided
   */
  async get_form(id) {
    try {
      if (!id) {
        throw new Error("The 'id' parameter is required");
      }

      const url =
        "https://script.google.com/macros/s/AKfycbwN76byYy3cpuzT64hKAw_YbrU51Pt5D6F8wpfslYYen-CPD6G5W9vx3OhgFIHXHvA0KA/exec";

      const response = await axios.get(url, { params: { id } });

      if (response.data.error) {
        console.error("Error from Google Apps Script:", response.data.error);
        return { error: response.data.error };
      }

      console.log("Form successfully retrieved from Google Apps Script");
      return response.data;
    } catch (error) {
      console.error("Error retrieving form:", error.message);
      return { error: "Could not retrieve form", details: error.message };
    }
  }



  /**
   * Migrates surveys received from a request to the database.
   * 
   * @async
   * @param {Array<Object>} surveys - List of surveys to migrate
   * @returns {Promise<Object>} Returns an object with migration status and number of surveys migrated
   * @throws {Error} If a problem occurs during migration or data is invalid
   */
  async migrate_surveys(surveys) {
    try {
      if (!Array.isArray(surveys) || surveys.length === 0) {
        console.log("📭 No surveys to migrate.");
        return { status: 400, error: "No surveys to migrate" };
      }

      const results = [];

      for (const survey of surveys) {
        const separatedSurvey = {
          name: survey.name,
          form_id: survey.form_id,
          completions: survey.completions,
        };

        const result = await this.surveyRepository.save(separatedSurvey);
        results.push(result);
      }

      console.log(`${results.length} surveys migrated from request body`);
      return {
        status: 200,
        message: "Migration completed",
        count: results.length,
      };
    } catch (err) {
      console.error("Error migrating surveys:", err.message);
      throw err;
    }
  }



  /**
   * Converts survey data into an Excel file (.xlsx).
   * 
   * If no surveys are passed as parameter, retrieves them directly from the repository.
   * Each survey includes its completions, respondents, and questions, which are dynamically
   * broken down into columns within the Excel file.
   * 
   * @async
   * @param {Array<Object>} [surveysParam] - Optional array of surveys to export. If omitted, all surveys are queried from DB
   * @param {string} [fileName="survey"] - Base name for the output file (without extension)
   * @returns {Promise<string>} Returns the full path of the generated Excel file
   * @throws {Error} If there are no surveys to export or if an error occurs during file generation
   */
  async convert_to_excel(surveysParam, fileName) {
    try {
      // If surveys are passed as parameter, use them; otherwise, get them from repository
      let surveys = surveysParam;
      if (!surveys || (Array.isArray(surveys) && surveys.length === 0)) {
        surveys = await this.surveyRepository.find_all();
      }

      if (!surveys || surveys.length === 0) {
        throw new Error("No surveys found to export to Excel.");
      }

      // Ensure downloads directory exists
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Survey");

      // Dynamically collect all found questions
      const allQuestions = new Set();
      for (const survey of surveys) {
        for (const completion of survey.completions || []) {
          for (const respondent of completion.respondents || []) {
            for (const question of respondent.questions || []) {
              allQuestions.add(question.question);
            }
          }
        }
      }

      // Define base Excel columns
      const baseColumns = [
        { header: "Survey Name", key: "name", width: 25 },
        { header: "Form ID", key: "form_id", width: 20 },
        { header: "Manager ID", key: "manager_id", width: 20 },
        { header: "Canteen ID", key: "canteen_id", width: 25 },
        { header: "Respondent Name", key: "fullName", width: 25 },
        { header: "Completion Date", key: "completionDate", width: 20 },
      ];

      // Create dynamic columns from unique questions
      const questionColumns = Array.from(allQuestions).map((q) => ({
        header: q,
        key: q,
        width: 30,
      }));

      worksheet.columns = [...baseColumns, ...questionColumns];

      // Fill Excel rows with hierarchical survey data
      for (const survey of surveys) {
        for (const completion of survey.completions || []) {
          for (const respondent of completion.respondents || []) {
            const rowData = {
              name: survey.name,
              form_id: survey.form_id,
              manager_id: completion.manager_id,
              canteen_id: completion.canteen_id,
              fullName: respondent.fullName,
              completionDate: respondent.completionDate,
            };

            for (const question of respondent.questions || []) {
              rowData[question.question] = question.answer;
            }

            worksheet.addRow(rowData);
          }
        }
      }

      // Define safe file name
      const name = fileName || "survey";
      const safeName = name
        .toString()
        .trim()
        .replace(/[^a-zA-Z0-9-_\. ]/g, "")
        .replace(/\s+/g, "_");

      const outPath = path.join(downloadsDir, `${safeName}.xlsx`);

      // Save Excel file to disk
      await workbook.xlsx.writeFile(outPath);
      console.log("Excel file generated:", outPath);

      return outPath;
    } catch (err) {
      console.error("Error exporting surveys to Excel:", err.message);
      throw err;
    }
  }
}
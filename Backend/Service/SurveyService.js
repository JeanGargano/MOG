/**
 * Service that manages operations related to surveys.
 *
 * Includes functions to:
 * - Retrieve forms from Google Apps Script
 * - Migrate surveys from request body to database
 * - Export surveys to Excel format (.xlsx) dynamically
 */

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import ExcelJS from "exceljs";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadsDir = path.join(__dirname, "..", "downloads");

export class SurveyService {
  constructor(surveyRepository) {
    this.surveyRepository = surveyRepository;
  }

  /**
   * Retrieves a form from the Google Apps Script endpoint and returns the JSON.
   */
  async get_form(id) {
    try {
      if (!id) {
        throw new Error("The 'id' parameter is required");
      }

      const url =
        "https://script.google.com/macros/s/AKfycbyMSF0JZFisVXvzbvcI3JLxCCXRD56mwcCsPa7GcEGxqXs46HdlODIDnhu3OyVYVbQt/exec";

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
   */
  async migrate_surveys(surveys) {
    try {
      if (!Array.isArray(surveys) || surveys.length === 0) {
        console.log("No surveys to migrate.");
        throw new Error("No surveys to migrate");
      }

      const results = [];

      for (const survey of surveys) {
        // Mapear las claves entrantes a las que espera el repositorio / modelo
        const separatedSurvey = {
          // `SurveyModel` espera `nombre` como campo requerido
          nombre: survey.name ?? survey.nombre ?? survey.title,
          // id del formulario (el repositorio busca `id_formulario`)
          id_formulario:
            survey.form_id ?? survey.id_formulario ?? survey.formId,
          // Realizaciones es la lista de completions/completions/responses
          Realizaciones:
            survey.completions ??
            survey.Realizaciones ??
            survey.responses ??
            [],
        };

        // Guardar usando el repositorio
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
   * Migrates surveys (same input as `migrate_surveys`) but additionally
   * generates one Excel file per distinct `id_formulario` (survey id).
   * Returns an array with objects containing the survey name and a
   * downloadable URL for each generated file.
   */
  async migrate_and_export_individual(surveys) {
    try {
      if (!Array.isArray(surveys) || surveys.length === 0) {
        console.log("No surveys to migrate.");
        throw new Error("No surveys to migrate");
      }

      // Map to accumulate incoming survey data per id_formulario.
      // We still save to the DB, but exports should use only the incoming
      // `Realizaciones` (to avoid exporting old DB entries unintentionally).
      const incomingByFormId = new Map();

      for (const survey of surveys) {
        const separatedSurvey = {
          nombre: survey.name ?? survey.nombre ?? survey.title,
          id_formulario:
            survey.form_id ?? survey.id_formulario ?? survey.formId,
          Realizaciones:
            survey.completions ??
            survey.Realizaciones ??
            survey.responses ??
            [],
        };

        // Save to DB (this may append realizaciones to existing document)
        const saved = await this.surveyRepository.save(separatedSurvey);

        // Determine canonical form id key
        const key =
          separatedSurvey.id_formulario ??
          saved.id_formulario ??
          saved._id?.toString();

        // Ensure an entry exists and accumulate only the incoming Realizaciones
        if (!incomingByFormId.has(key)) {
          incomingByFormId.set(key, {
            nombre: separatedSurvey.nombre ?? saved.nombre ?? key,
            id_formulario: key,
            Realizaciones: [],
          });
        }

        const entry = incomingByFormId.get(key);
        if (
          Array.isArray(separatedSurvey.Realizaciones) &&
          separatedSurvey.Realizaciones.length > 0
        ) {
          entry.Realizaciones.push(...separatedSurvey.Realizaciones);
        }
        incomingByFormId.set(key, entry);
      }

      // Ensure downloads directory exists
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      const results = [];

      // For each distinct form id from the incoming payload, generate one Excel per `id_comedor`
      for (const [formId, surveyDoc] of incomingByFormId.entries()) {
        const safeBaseName = (surveyDoc.nombre ?? formId).toString();
        const safeNameBase = safeBaseName
          .trim()
          .replace(/[^a-zA-Z0-9-_. ]/g, "")
          .replace(/\s+/g, "_");

        // Group realizaciones by id_comedor from incoming data
        const byCanteen = new Map();
        for (const realizacion of surveyDoc.Realizaciones || []) {
          const comedorId =
            realizacion.id_comedor ??
            realizacion.canteen_id ??
            "unknown_comedor";
          if (!byCanteen.has(comedorId)) byCanteen.set(comedorId, []);
          byCanteen.get(comedorId).push(realizacion);
        }

        // If there are no incoming realizaciones, still generate an empty file for the survey
        if (byCanteen.size === 0) {
          const now = new Date();
          const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
          const filename = `${safeNameBase || formId}_${ts}.xlsx`;
          const outPath = path.join(downloadsDir, filename);
          await this._generate_excel_for_survey(surveyDoc, outPath);
          const url = `/download_excel?file=${encodeURIComponent(filename)}`;
          results.push({
            nombre: surveyDoc.nombre ?? safeBaseName,
            file: filename,
            url,
            comedor: null,
          });
          continue;
        }

        // Generate one file per canteen (based only on incoming realizaciones)
        for (const [comedorId, realizaciones] of byCanteen.entries()) {
          const surveySlice = Object.assign({}, surveyDoc, {
            Realizaciones: realizaciones,
          });

          // Try to extract a friendly name for the comedor from the realizacion
          const first =
            realizaciones && realizaciones.length > 0 ? realizaciones[0] : null;
          const comedorNombre =
            (first &&
              (first.nombre_comedor ??
                first.nombreComedor ??
                first.comedor ??
                first.canteen_name ??
                first.comedorNombre)) ||
            String(comedorId);

          const safeComedor = String(comedorNombre)
            .toString()
            .trim()
            .replace(/[^a-zA-Z0-9-_\.]/g, "_");
          const now = new Date();
          const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
          const filename = `${safeNameBase || formId}_${safeComedor}_${ts}.xlsx`;
          const outPath = path.join(downloadsDir, filename);

          await this._generate_excel_for_survey(surveySlice, outPath);

          const url = `/download_excel?file=${encodeURIComponent(filename)}`;
          results.push({
            nombre: surveyDoc.nombre ?? safeBaseName,
            file: filename,
            url,
            comedor: comedorId,
            comedorNombre,
          });
        }
      }

      return results;
    } catch (err) {
      console.error("Error migrating and exporting surveys:", err.message);
      throw err;
    }
  }

  /**
   * Helper: generate an Excel file for a single saved survey document
   * according to the schema used in `SurveyModel` (Spanish fields).
   * - `survey.Realizaciones` -> array of realizations
   * - each realization has `id_encargado`, `id_comedor`, `encuestados`
   * - each encuestado has `nombreCompleto`, `preguntas` (with `pregunta`/`respuesta`)
   */
  async _generate_excel_for_survey(surveyDoc, outPath) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Survey");

      // Collect dynamic question headings
      const allQuestions = new Set();

      for (const realizacion of surveyDoc.Realizaciones || []) {
        for (const encuestado of realizacion.encuestados || []) {
          for (const pregunta of encuestado.preguntas || []) {
            if (pregunta && pregunta.pregunta)
              allQuestions.add(pregunta.pregunta);
          }
        }
      }

      const baseColumns = [
        { header: "Survey Name", key: "nombre", width: 25 },
        { header: "Form ID", key: "id_formulario", width: 20 },
        { header: "Manager ID", key: "id_encargado", width: 20 },
        { header: "Canteen ID", key: "id_comedor", width: 25 },
        { header: "Canteen Name", key: "comedorNombre", width: 30 },
        { header: "Respondent Name", key: "nombreCompleto", width: 30 },
        { header: "Completion Date", key: "fechaRealizacion", width: 20 },
      ];

      const questionColumns = Array.from(allQuestions).map((q) => ({
        header: q,
        key: q,
        width: 40,
      }));

      worksheet.columns = [...baseColumns, ...questionColumns];

      for (const realizacion of surveyDoc.Realizaciones || []) {
        for (const encuestado of realizacion.encuestados || []) {
          const rowData = {
            nombre: surveyDoc.nombre,
            id_formulario: surveyDoc.id_formulario,
            id_encargado: realizacion.id_encargado,
            id_comedor: realizacion.id_comedor,
            comedorNombre:
              realizacion.nombre_comedor ??
              realizacion.nombreComedor ??
              realizacion.comedor ??
              realizacion.canteen_name ??
              realizacion.comedorNombre ??
              "",
            nombreCompleto: encuestado.nombreCompleto,
            fechaRealizacion: encuestado.fechaRealizacion
              ? new Date(encuestado.fechaRealizacion)
              : "",
          };

          for (const pregunta of encuestado.preguntas || []) {
            if (pregunta && pregunta.pregunta) {
              rowData[pregunta.pregunta] = pregunta.respuesta ?? "";
            }
          }

          worksheet.addRow(rowData);
        }
      }

      await workbook.xlsx.writeFile(outPath);
      console.log("Excel file generated for survey:", outPath);
    } catch (err) {
      console.error("Error generating Excel for survey:", err.message);
      throw err;
    }
  }

  /**
   * Converts survey data into an Excel file (.xlsx).
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

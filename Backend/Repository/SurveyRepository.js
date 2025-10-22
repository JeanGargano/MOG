/**
 * @file SurveyRepository.js
 * @description
 * Repository responsible for interaction with the MongoDB database
 * for CRUD operations related to surveys (encuestas).
 *
 * This layer communicates directly with the `SurveyModel`
 * and is in charge of storing, updating, and querying surveys.
 *
 * Part of the system's hexagonal architecture, acting as
 * the secondary adapter (infrastructure) between the database
 * and the service layer.
 */

import SurveyModel from "../Model/SurveyModel.js";

/**
 * Class that implements persistence methods for surveys.
 * 
 */
export class SurveyRepository {

  /**
   * Saves a new survey or updates an existing one.
   *
   * If a survey with the same `id_formulario` already exists,
   * new completions (realizaciones) are added to the existing array.
   * Otherwise, a new document is created.
   *
   * @async
   * @function save
   * @param {Object} data - Survey data.
   * @param {string} data.nombre - Name of the survey.
   * @param {string} data.id_formulario - Unique form identifier.
   * @param {Array<Object>} data.Realizaciones - Array of survey completions.
   * 
   * @returns {Promise<Object>} Saved or updated survey document in MongoDB.
   * 
   * @throws {Error} If a problem occurs while interacting with the database.
   * 
   */
  async save(data) {
    const { id_formulario, Realizaciones } = data;

    // Check if a survey with the same ID already exists
    const existingSurvey = await SurveyModel.findOne({ id_formulario });

    if (existingSurvey) {
      // Add new completions to existing ones
      existingSurvey.Realizaciones.push(...Realizaciones);
      return await existingSurvey.save();
    } else {
      // Create a new document if it doesn't exist
      const newSurvey = new SurveyModel({
        nombre: data.nombre,
        Realizaciones: data.Realizaciones,
        id_formulario: data.id_formulario,
      });
      return await newSurvey.save();
    }
  }



  /**
   * Retrieves all surveys stored in the database.
   *
   * Uses `.lean()` to return plain JavaScript objects instead of Mongoose documents,
   * improving performance for read-only operations.
   *
   * @async
   * @function find_all
   * @returns {Promise<Array<Object>>} Array of surveys in JSON format.
   *
   * @example
   * const allSurveys = await surveyRepository.find_all();
   * console.log(`Total surveys: ${allSurveys.length}`);
   */
  async find_all() {
    return await SurveyModel.find({}).lean();
  }
}
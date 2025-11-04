/**
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

import SurveyModel from "../model/SurveyModel.js";

export class SurveyRepository {


  /**
   * Saves a new survey or updates an existing one.
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
   */
  async find_all() {
    return await SurveyModel.find({}).lean();
  }
}
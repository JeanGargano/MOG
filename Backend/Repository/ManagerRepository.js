/**
 * Repository responsible for interaction with the MongoDB database
 * for operations related to managers (encargados).
 *
 * This class acts as a secondary adapter within the hexagonal architecture,
 * providing an abstraction layer between the service and the data model (`ManagerModel`).
 */

import ManagerModel from "../Model/ManagerModel.js";

export class ManagerRepository {



  /**
   * Searches for a manager in the database by their identification number.
   * @param {string|number} identificacion - Unique identification number of the manager.
   * @returns {Promise<Object|null>} Manager document if exists, or `null` if not found.
   */
  async find_by_identification(identificacion) {
    return await ManagerModel.findOne({ identificacion });
  }



  /**
   * Creates a new manager in the database.
   * @returns {Promise<Object>} Created manager document.
   * @throws {Error} If an error occurs during creation in MongoDB.
   */
  async create_manager(data) {
    return await ManagerModel.create(data);
  }



  /**
   * Adds or updates additional fields in a manager's document.
   *
   * This method is useful for updating partial information (e.g., assigning a comedor or role)
   * without needing to replace the entire document.
   * @param {string|number} identificacion - Identification of the manager to update.
   * @param {Object} nuevosCampos - Fields to add or update.
   * @returns {Promise<Object|null>} Updated document if exists, or `null` if manager was not found.
   */
  async add_fields(identificacion, nuevosCampos) {
    return await ManagerModel.findOneAndUpdate(
      { identificacion },
      { $set: nuevosCampos },
      { new: true }
    );
  }
}
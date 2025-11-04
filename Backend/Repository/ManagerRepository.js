/**
 * Repository responsible for interaction with the MongoDB database
 * for operations related to managers (encargados).
 *
 * This class acts as a secondary adapter within the hexagonal architecture,
 * providing an abstraction layer between the service and the data model (`ManagerModel`).
 */

import ManagerModel from "../model/ManagerModel.js";

export class ManagerRepository {



  /**
   * Searches for a manager in the database by their identification number.
   */
  async find_by_identification(identificacion) {
    return await ManagerModel.findOne({ identificacion });
  }



  /**
   * Creates a new manager in the database.
   */
  async create_manager(data) {
    return await ManagerModel.create(data);
  }



  /**
   * Adds or updates additional fields in a manager's document.
   */
  async add_fields(identificacion, nuevosCampos) {
    return await ManagerModel.findOneAndUpdate(
      { identificacion },
      { $set: nuevosCampos },
      { new: true }
    );
  }
}
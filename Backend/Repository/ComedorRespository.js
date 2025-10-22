/**
 * Repository responsible for interaction with the MongoDB database
 * for operations related to comedores (dining halls).
 *
 * This class serves as a secondary adapter within the hexagonal architecture,
 * encapsulating data access logic and maintaining domain independence.
 */

import ComedorModel from "../Model/ComedorModel.js";

/**
 * Class that implements persistence methods for the "Comedor" entity.
 */
export class ComedorRepository {
  /**
   * Creates a new comedor record in the database.
   *
   * @async
   * @function postComedor
   * @param {Object} data - Comedor data to register.
   * @returns {Promise<Object>} Created comedor document in the database.
   * 
   * @throws {Error} If an error occurs during insertion in MongoDB.
   * 
   */
  async post_comedor(data) {
    try {
      const comedor = new ComedorModel(data);
      return await comedor.save();
    } catch (error) {
      throw new Error("Error saving comedor: " + error.message);
    }
  }



  /**
   * Retrieves all comedores registered in the database.
   *
   * @async
   * @function findComedores
   * @returns {Promise<Array<Object>>} Array with all comedor documents.
   * 
   */
  async find_comedores() {
    return await ComedorModel.find({});
  }



  /**
   * Searches for multiple comedores by a list of identifiers (IDs).
   *
   * @async
   * @function findComedoresByIds
   * @param {Array<string>} ids - List of comedor IDs to search for.
   * @returns {Promise<Array<Object>>} List of comedores matching the IDs.
   * 
   */
  async find_comedores_by_ids(ids) {
    return await ComedorModel.find({ _id: { $in: ids } });
  }



  /**
   * Searches for comedores whose name matches (totally or partially) the provided text.
   *
   * Performs a **case-insensitive search** using regular expressions.
   *
   * @async
   * @function findComedoresByName
   * @param {string} name - Partial or complete text of the comedor name to search for.
   * @returns {Promise<Array<Object>>} List of comedores whose name matches the pattern.
   * 
   */
  async find_comedores_by_name(name) {
    return await ComedorModel.find({ nombre: new RegExp(name, "i") });
  }
}
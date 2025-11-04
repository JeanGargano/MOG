/**
 * Repository responsible for interaction with the MongoDB database
 * for operations related to comedores (dining halls).
 *
 * This class serves as a secondary adapter within the hexagonal architecture,
 * encapsulating data access logic and maintaining domain independence.
 */

import ComedorModel from "../Model/ComedorModel.js";

export class ComedorRepository {



  /**
   * Creates a new comedor record in the database.
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
   */
  async find_comedores() {
    return await ComedorModel.find({});
  }



  /**
   * Searches for multiple comedores by a list of identifiers (IDs).
   */
  async find_comedores_by_ids(ids) {
    return await ComedorModel.find({ _id: { $in: ids } });
  }



  /**
   * Searches for comedores whose name matches (totally or partially) the provided text.
   * Performs a **case-insensitive search** using regular expressions.
   */
  async find_comedores_by_name(name) {
    return await ComedorModel.find({ nombre: new RegExp(name, "i") });
  }
}
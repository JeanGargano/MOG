/**
 * Service layer responsible for managing business logic related to dining halls (comedores).
 *
 * This service acts as an intermediary between the controller and the repository,
 * handling validation and application rules before interacting with the database.
 *
 */
export class ComedorService {
  constructor(comedorRepository) {
    this.comedorRepository = comedorRepository;
  }

  /**
   * Creates a new dining hall.
   *
   * @async
   * @function postComedor
   * @param {Object} data - Data of the dining hall to be registered.
   * @param {string} data.nombre - Dining hall name.
   * @param {string} data.pais - Country where the dining hall is located.
   * @returns {Promise<Object>} Returns the created dining hall.
   * @throws {Error} If required fields `nombre` or `pais` are missing.
   *
   */
  async post_comedor(data) {
    if (!data.nombre || !data.pais) {
      throw new Error("The fields 'nombre' and 'pais' are required");
    }
    return await this.comedorRepository.post_comedor(data);
  }



  /**
   * Retrieves the list of all registered dining halls.
   *
   * @async
   * @function findComedores
   * @returns {Promise<Array>} List of available dining halls.
   * @throws {Error} If no dining halls are found in the database.
   *
   */
  async find_comedores() {
    const comedores = await this.comedorRepository.find_comedores();
    if (!comedores || comedores.length === 0) {
      throw new Error("No dining halls found in the database");
    }
    return comedores;
  }




  /**
   * Searches dining halls by their unique identifiers.
   *
   * @async
   * @function findComedoresByIds
   * @param {Array<string>} ids - Array containing the IDs of the dining halls to search.
   * @returns {Promise<Array>} List of dining halls matching the provided IDs.
   *
   */
  async find_comedores_by_ids(ids) {
    return await this.comedorRepository.find_comedores_by_ids(ids);
  }



  /**
   * Searches dining halls by name.
   *
   * @async
   * @function findComedoresByName
   * @param {string} name - Name of the dining hall to search for.
   * @returns {Promise<Array>} List of dining halls that match the provided name.
   * @throws {Error} If the `name` field is not provided.
   *
   * @example
   * const results = await comedorService.findComedoresByName("Central");
   */
  async find_comedores_by_name(name) {
    if (!name) {
      throw new Error("The field 'name' is required");
    }
    return await this.comedorRepository.find_comedores_by_name(name);
  }
}

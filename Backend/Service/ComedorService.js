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
   */
  async post_comedor(data) {
    if (!data.nombre || !data.pais) {
      throw new Error("The fields 'nombre' and 'pais' are required");
    }
    return await this.comedorRepository.post_comedor(data);
  }



  /**
   * Retrieves the list of all registered dining halls.
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
   */
  async find_comedores_by_ids(ids) {
    return await this.comedorRepository.find_comedores_by_ids(ids);
  }



  /**
   * Searches dining halls by name.
   */
  async find_comedores_by_name(name) {
    if (!name) {
      throw new Error("The field 'name' is required");
    }
    return await this.comedorRepository.find_comedores_by_name(name);
  }
}

/**
 * Service responsible for handling business logic associated with managers (encargados).
 * Communicates with the corresponding repository to perform CRUD operations
 * and applies validation and security rules (such as password encryption).
 */
import bcrypt from "bcrypt";

export class ManagerService {
  constructor(managerRepository) {
    this.managerRepository = managerRepository;
  }

  /**
   * Finds a manager by their identification number.
   * 
   * @async
   * @param {number|string} identificacion - Manager's identification number.
   * @returns {Promise<Object>} Returns the found manager object.
   * @throws {Error} If identification is not provided or manager does not exist.
   */
  async find_by_identification(identificacion) {
    if (!identificacion) {
      throw new Error("Invalid identification");
    }
    const manager =
      await this.managerRepository.find_by_identification(identificacion);
    if (!manager) {
      throw new Error("Manager not found");
    }
    return manager;
  }



  /**
   * Creates a new manager in the system.
   * 
   * @async
   * @param {Object} data - Manager data to register.
   * @returns {Promise<Object>} Returns the created manager.
   * @throws {Error} If required fields are missing, if manager already exists, or if password doesn't meet requirements.
   */
  async create_manager(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data for creating manager");
    }

    const existingManager =
      await this.managerRepository.find_by_identification(data.identificacion);
    if (existingManager) {
      throw new Error("A manager with this identification already exists");
    }

    const requiredFields = ["identificacion", "nombreCompleto"];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const manager = await this.managerRepository.create_manager(data);
    if (!manager) {
      throw new Error("Could not create manager");
    }
    return manager;
  }



  /**
   * Adds or updates fields in an existing manager.
   * 
   * @async
   * @param {number} identificacion - Identification of the manager to update.
   * @param {Object} newFields - Fields to add or modify.
   * @returns {Promise<Object>} Returns the updated manager.
   * @throws {Error} If identification is invalid, fields are not valid, or update fails.
   */
  async add_fields(identificacion, newFields) {
    if (!identificacion || typeof identificacion !== "number") {
      throw new Error("Invalid identification");
    }
    if (!newFields || typeof newFields !== "object") {
      throw new Error("New fields must be an object");
    }

    // Encrypts new password if included
    const plainPassword = newFields.contraseña;
    if (plainPassword) {
      if (typeof plainPassword !== "string" || plainPassword.length <= 4) {
        throw new Error(
          "New password must be a valid string of at least 4 characters"
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      newFields.contraseña = hashedPassword;
    }

    const updated = await this.managerRepository.add_fields(
      identificacion,
      newFields
    );
    if (!updated) {
      throw new Error("Could not add fields");
    }
    return updated;
  }



  /**
   * Authenticates a manager in the system.
   * 
   * @async
   * @param {Object} credentials - Manager credentials.
   * @param {number} credentials.identificacion - Manager's identification.
   * @param {string} credentials.contraseña - Password entered by the manager.
   * @returns {Promise<Object>} Returns a success message and authenticated manager data.
   * @throws {Error} If identification or password are invalid, or don't match records.
   */
  async login_manager({ identificacion, contraseña }) {
    if (!identificacion || typeof identificacion !== "number") {
      throw new Error("Invalid identification");
    }
    if (!password || typeof password !== "string") {
      throw new Error("Invalid password");
    }

    const manager =
      await this.managerRepository.find_by_identification(identificacion);
    if (!manager) {
      throw new Error("Identification not found in the system");
    }

    const validPassword = await bcrypt.compare(
      contraseña,
      manager.contraseña
    );
    if (!validPassword) {
      throw new Error("Incorrect password");
    }

    return { message: "Login successful", manager };
  }
}
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
   * Adds or updates fields in an existing manager..
   */
  async add_fields(identificacion, newFields) {
    if (!identificacion || typeof identificacion !== "number") {
      throw new Error("Invalid identification");
    }
    if (!newFields || typeof newFields !== "object") {
      throw new Error("New fields must be an object");
    }

    // Encrypts new password if included
    const plainPassword = newFields.password;
    if (plainPassword) {
      if (typeof plainPassword !== "string" || plainPassword.length <= 4) {
        throw new Error(
          "New password must be a valid string of at least 4 characters"
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      newFields.password = hashedPassword;
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
   */
  async login_manager({ identificacion, password }) {
    if (!identificacion || typeof identificacion !== "number") {
      throw new Error("Invalid identification");
    }
    if (!password || typeof password !== "string") {
      throw new Error("Invalid password");
    }

    const manager = await this.managerRepository.find_by_identification(identificacion);
    if (!manager) {
      throw new Error("Identification not found in the system");
    }

    const validPassword = await bcrypt.compare(
      password,
      manager.password
    );
    if (!validPassword) {
      throw new Error("Incorrect password");
    }

    return { message: "Login successful", manager };
  }
}
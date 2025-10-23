/**
 * Controller responsible for managing operations related to dining halls (comedores).
 *
 * This controller acts as an intermediary between HTTP requests and the service layer (`ComedorService`),
 * handling the logic to create, retrieve, and search dining halls in the system.
 *
 */
export class ComedorController {
  constructor(comedorService) {
    this.comedorService = comedorService;
  }

  /**
   * Creates a new dining hall in the database.
   *
   * @param {import("express").Request} req - HTTP request containing the dining hall data in `req.body`.
   * @param {import("express").Response} res - HTTP response object.
   * @returns {Promise<void>} Returns a success message along with the created dining hall.
   */
  async post_comedor(req, res) {
    try {
      const comedor = await this.comedorService.post_comedor(req.body);
      res.status(201).json({ message: "Dining hall created successfully", comedor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }




  /**
   * Retrieves all registered dining halls from the database.
   * @param {import("express").Request} req - HTTP request.
   * @param {import("express").Response} res - HTTP response object.
   * @returns {Promise<void>} Returns an array with all available dining halls.
   */
  async find_comedores(req, res) {
    try {
      const comedores = await this.comedorService.find_comedores();
      res.status(200).json(comedores);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }



  /**
   * Retrieves dining halls that match the provided IDs.
   * @param {import("express").Request} req - HTTP request containing an array of IDs in `req.body`.
   * @param {import("express").Response} res - HTTP response object.
   * @returns {Promise<void>} Returns a list of dining halls matching the provided IDs.
   */
  async get_comedores_by_ids(req, res) {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "An array of IDs is required" });
    }

    try {
      const comedores = await this.comedorService.get_comedores_by_ids(ids);
      res.status(200).json(comedores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }




  /**
   * Searches dining halls by name.
   * @param {import("express").Request} req - HTTP request containing the field `name` in `req.body`.
   * @param {import("express").Response} res - HTTP response object.
   * @returns {Promise<void>} Returns the dining halls whose names match the search criteria.
   */
  async find_comedores_by_name(req, res) {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "The field 'name' is required" });
    }

    try {
      const comedores = await this.comedorService.find_comedores_by_name(nombre);
      res.status(200).json(comedores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

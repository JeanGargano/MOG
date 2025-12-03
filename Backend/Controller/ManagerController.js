/**
 * Controller that manages operations related to managers (encargados).
 *
 * This controller communicates with the service layer (`EncargadoService`)
 * to perform CRUD operations and authentication for managers.
 */
export class ManagerController {
  constructor(managerService) {
    this.managerService = managerService;
  }



  /**
   * Finds a manager in the database by their identification number.
   */
  async find_by_identification(req, res) {
    try {
      const { identificacion } = req.query;
      const manager = await this.managerService.find_by_identification(identificacion);
      res.status(200).json(manager);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async all_manager(req, res){
    try{
      const managers = await this.managerService.all_manager();
      res.status(200).json(managers);
    }catch(error){
      res.status(500).json({ error: error.message });
    }
  }
  

  /**
   * Creates a new manager in the database.
   */
  async create_manager(req, res) {
    try {
      const result = await this.managerService.create_manager(req.body);
      res.status(200).json({ message: "Manager successfully created", result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



  /**
   * Adds new fields or updates existing information for a manager.
   */
  async add_fields(req, res) {
    try {
      const { identificacion } = req.body;
      const updated = await this.managerService.add_fields(identificacion, req.body);
      res.status(200).json({ message: "Fields updated successfully", updated });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }



  /**
   * Authenticates (logs in) a manager in the system.
   */
  async login_manager(req, res) {
    try {
      const response = await this.managerService.login_manager(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

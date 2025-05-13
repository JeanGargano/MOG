//Clase de controladores para comedor
export class ComedorController {
  constructor(comedorService) {
    this.comedorService = comedorService;
  }

  //Controlador para crear comedor
  async postComedor(req, res) {
    try {
      const comedor = await this.comedorService.postComedor(req.body);
      res.status(201).json({ message: "Comedor creado exitosamente", comedor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  //Controlador para obtener comedores
  async findComedores(req, res) {
    try {
      const comedores = await this.comedorService.findComedores();
      res.status(200).json(comedores);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Controlador para obtener comedores por ID
  async getComedoresByIds(req, res) {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Se requiere un array de IDs" });
    }

    try {
      const comedores = await this.comedorService.findComedoresByIds(ids);
      res.status(200).json(comedores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

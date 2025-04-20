// Controllers/EncargadoController.js
import { EncargadoService } from "../Service/EncargadoService.js";

export default class EncargadoController {

  static async getEncargado(req, res) {
    try {
        const { name } = req.query;
        const encargado = await EncargadoService.getEncargado(name);
        res.status(200).json(encargado);
    }catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

}

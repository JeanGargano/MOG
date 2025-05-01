//Clase de controladores para Encargado
export class EncargadoController {

  //Metodo constructor
  constructor(encargadoService) {
    this.encargadoService = encargadoService;
  }

  async getEncargado(req, res) { 
    try {
      const { name } = req.query;
      const encargado = await this.encargadoService.autenticarEncargado(name);
      res.status(200).json(encargado);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Controlador Para crear Encargado
  async postEncargado(req, res) {
    try {
      const result = await this.encargadoService.crearEncargado(req.body);
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      } else {
        return res.status(200).json({ message: "Se ha creado el Encargado exitosamente" });
      }
    } catch (error) {
      console.error("Error en encargado Controller:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    } 
  }

}

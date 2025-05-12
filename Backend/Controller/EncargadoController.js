//Controladores para encargado
export class EncargadoController {

  constructor(encargadoService) {
    this.encargadoService = encargadoService;
  }

  //Encontrar un encargado por su identificacion
  async findByIdentificacion(req, res) {
    try {
      const { identificacion } = req.query;
      const encargado = await this.encargadoService.findByIdentificacion(identificacion);
      res.status(200).json(encargado);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  //Crear un encargado
  async postEncargado(req, res) {
    try {
      const result = await this.encargadoService.postEncargado(req.body);
      res.status(200).json({ message: "Encargado creado exitosamente", result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Añade los nuevos campos al encargado
  async agregarCampos(req, res) {
    try {
      const { identificacion } = req.body;
      const actualizado = await this.encargadoService.agregarCampos(identificacion, req.body);
      res.status(200).json({ message: "Campos añadidos correctamente", actualizado });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  //Logea un encargado
  async logearEncargado(req, res) {
    try {
      const response = await this.encargadoService.logearEncargado(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

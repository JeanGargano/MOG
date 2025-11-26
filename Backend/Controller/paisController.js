import paisService from "../Service/paisService.js";

class PaisController {
  listar(req, res) {
    res.json(paisService.listar());
  }

  crear(req, res) {
    const { nombre } = req.body;
    try {
      const pais = paisService.crear(nombre);
      res.json(pais);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  editar(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;

    const pais = paisService.editar(parseInt(id), nombre);
    if (!pais) return res.status(404).json({ error: "Pais no encontrado" });

    res.json(pais);
  }

  eliminar(req, res) {
    const { id } = req.params;
    const eliminado = paisService.eliminar(parseInt(id));

    if (!eliminado)
      return res.status(404).json({ error: "Pais no encontrado" });

    res.json({ mensaje: "País eliminado correctamente" });
  }
}

export default new PaisController();

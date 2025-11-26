import paisRepository from "../Repository/paisRepository.js";

class PaisService {
  listar() {
    return paisRepository.getAll();
  }

  crear(nombre) {
    if (!nombre || nombre.trim() === "") {
      throw new Error("El nombre del país es obligatorio");
    }
    return paisRepository.create(nombre.trim());
  }

  editar(id, nombre) {
    return paisRepository.update(id, nombre);
  }

  eliminar(id) {
    return paisRepository.delete(id);
  }
}

export default new PaisService();

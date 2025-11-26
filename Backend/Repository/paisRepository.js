import { Helper } from "../Helpers/Helpers.js";
import Pais from "../Model/Pais.js";

class PaisRepository {
  getAll() {
    return Helper.readJSON();
  }

  getById(id) {
    const paises = Helper.readJSON();
    return paises.find((p) => p.id === id);
  }

  create(nombre) {
    const paises = Helper.readJSON();
    const nuevoPais = new Pais(nombre);

    paises.push(nuevoPais);
    Helper.writeJSON(paises);

    return nuevoPais;
  }

  update(id, nuevoNombre) {
    const paises = Helper.readJSON();
    const index = paises.findIndex((p) => p.id === id);

    if (index === -1) return null;

    paises[index].nombre = nuevoNombre;
    Helper.writeJSON(paises);

    return paises[index];
  }

  delete(id) {
    let paises = Helper.readJSON();
    const originalLength = paises.length;

    paises = paises.filter((p) => p.id !== id);

    if (paises.length === originalLength) return false;

    Helper.writeJSON(paises);
    return true;
  }
}

export default new PaisRepository();

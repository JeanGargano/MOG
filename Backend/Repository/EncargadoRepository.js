// Capa de persistencia para encargado
import EncargadoModel from "../Model/EncargadoModel.js";

export class EncargadoRepository {

  async findByName(name) {
    return await EncargadoModel.findOne({ nombreCompleto: name });
  }

  async getAll() {
    return await EncargadoModel.find();
  }
}

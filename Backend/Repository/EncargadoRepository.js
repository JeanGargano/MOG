// Capa de persistencia para encargado
import EncargadoModel from "../Model/EncargadoModel.js";

export class EncargadoRepository {


  async getAll() {
    return await EncargadoModel.find();
  }
}

import EncargadoModel from "../Model/EncargadoModel.js";

export class EncargadoRepository {

  async findByIdentificacion(identificacion) {
    return await EncargadoModel.findOne({ identificacion });
  }

  async postEncargado(data) {
    return await EncargadoModel.create(data);
  }

  async agregarCampos(identificacion, nuevosCampos) {
  return await EncargadoModel.findOneAndUpdate(
    { identificacion },
    { $set: nuevosCampos },
    { new: true }
  );
  }
}

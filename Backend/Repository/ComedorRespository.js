import ComedorModel from "../Model/ComedorModel.js";

export class ComedorRepository {
  async postComedor(data) {
    try {
      const comedor = new ComedorModel(data);
      return await comedor.save();
    } catch (error) {
      throw new Error("Error al guardar el comedor: " + error.message);
    }
  }

  async findComedores() {
    return await ComedorModel.find({});
  }

  async findComedoresByIds(ids) {
    return await ComedorModel.find({ _id: { $in: ids } });
  }
  async findComedoresByName(name) {
    return await ComedorModel.find({ nombre: new RegExp(name, "i") });
  }
}

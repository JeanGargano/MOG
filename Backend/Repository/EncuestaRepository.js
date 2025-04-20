import EncuestaModel from "../Model/EncuestaModel.js";

export class EncuestaRepository {

    //Guardar Data
    async save(data) {
        return await EncuestaModel.create(data);
    }
}

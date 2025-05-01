import EncuestaModel from "../Model/EncuestaModel.js";

export class EncuestaRepository {

    // Guardar Data
    async save(data) {
        const { id_formulario, Realizaciones } = data;

        // Buscar si ya existe una encuesta con el mismo id
        const encuestaExistente = await EncuestaModel.findOne({ id_formulario });

        if (encuestaExistente) {
            encuestaExistente.Realizaciones.push(...Realizaciones);
            return await encuestaExistente.save();
        
        //Sino existe, crea un nuevo documento con la información de la nueva encuesta
        } else {
            const nuevaEncuesta = new EncuestaModel({
                nombre: data.nombre,
                Realizaciones: data.Realizaciones,
                id_formulario: data.id_formulario
            });
            return await nuevaEncuesta.save();
        }
    }
}

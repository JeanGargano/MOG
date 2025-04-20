// Modelo de datos para encuesta
import mongoose from 'mongoose';

const EncuestaSchema = new mongoose.Schema({
  fecha: { type: Date },
  nombre: { type: String },
  encargadoId: { type: String, ref: 'Personal' }, // Referencia a Personal
  comedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comedor' }, // Referencia a Comedor
  encuestados: [{
    nombreCompleto: { type: String },
    nacionalidad: { type: String },
    edad: { type: String },
    ciudad: { type: String },
    localidad: { type: String },
    estrato: { type: String },
    preguntas: [{
      pregunta: { type: String },
      respuesta: { type: String }
    }]
  }]
}, {
  collection: 'Encuesta' // 👈 Fuerza el uso de la colección existente
});

const EncuestaModel = mongoose.model('Encuesta', EncuestaSchema);
export default EncuestaModel;

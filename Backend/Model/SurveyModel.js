// Data model for Surveys
import mongoose from 'mongoose';


/**
 * Encuestado Schema
 * Represents a surveyed person who participates in a survey.
 * `_id: false` means this subdocument does not create its own MongoDB ObjectId.
 */
const EncuestadoSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  nacionalidad: { type: String, required: true },
  edad: { type: String },
  ciudad: { type: String, required: true },
  localidad: { type: String },
  estrato: { type: String },
  preguntas: [{
    pregunta: { type: String },
    respuesta: { type: String }
  }],
  fechaRealizacion: { type: Date, default: Date.now }
}, { _id: false });



/**
 * Realizacion Schema
 * Represents a completed survey session associated with:
 * - a manager (`id_encargado`)
 * - a dining hall (`id_comedor`)
 */
const RealizacionSchema = new mongoose.Schema({
  id_encargado: { type: String, required: true },
  id_comedor: { type: String, required: true },
  encuestados: [EncuestadoSchema]
}, { _id: false });



/**
 * Encuesta Schema
 * Represents a survey template or form type in the system.
 */
const EncuestaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  Realizaciones: [RealizacionSchema],
  id_formulario: { type: String }
}, {
  collection: 'Encuesta'
});



// Model used to interact with the "Encuesta" collection in MongoDB
const SurveyModel = mongoose.model('Encuesta', EncuestaSchema);

export default SurveyModel;

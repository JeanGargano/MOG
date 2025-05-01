import mongoose from 'mongoose';

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

const RealizacionSchema = new mongoose.Schema({
  id_encargado: { type: String, required: true },
  id_comedor: { type: String, required: true },
  encuestados: [EncuestadoSchema]
}, { _id: false });

const EncuestaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  Realizaciones: [RealizacionSchema],
  id_formulario: { type: String }
}, {
  collection: 'Encuesta'
});

const EncuestaModel = mongoose.model('Encuesta', EncuestaSchema);
export default EncuestaModel



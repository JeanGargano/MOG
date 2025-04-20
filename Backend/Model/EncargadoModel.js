//Modelo de datos para personal
import mongoose from 'mongoose';

const EncargadoSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  nombreCompleto: { type: String, required: true }
});

const EncargadoModel = mongoose.model('Encargado', EncargadoSchema);
export default EncargadoModel;

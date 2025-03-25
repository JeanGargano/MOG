//Modelo de datos para comedor
import mongoose from 'mongoose';

const ComedorSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  nombre: { type: String, required: true },
  pais: { type: String, required: true }
});

const ComedorModel = mongoose.model('Comedor', ComedorSchema);
export default ComedorModel;

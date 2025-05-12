//Modelo de datos para comedor
import mongoose from 'mongoose';

const ComedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  pais: { type: String, required: true }
}, {

  collection: "Comedor"
}
);

const ComedorModel = mongoose.model('Comedor', ComedorSchema);
export default ComedorModel;

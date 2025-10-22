//Modelo de datos para Encargado
import mongoose from "mongoose";

const EncargadoSchema = new mongoose.Schema(
  {
    nombreCompleto: { type: String, required: true },
    identificacion: { type: Number, required: true, unique: true },
    comedores: { type: Array, required: false },
    pais: { type: String, required: false },
    telefono: { type: Number, required: false },
    contraseña: { type: String, required: false },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    collection: "Encargado",
  },
);

const ManagerModel = mongoose.model("Encargado", EncargadoSchema);
export default ManagerModel;

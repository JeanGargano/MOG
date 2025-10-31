// Data model for Manager (Encargado)
import mongoose from "mongoose";

/**
 * Encargado Schema
 * Represents a manager/user in the system.
 */
const EncargadoSchema = new mongoose.Schema(
  {
    nombreCompleto: { type: String, required: true },
    identificacion: { type: Number, required: true, unique: true },
    comedores: { type: Array, required: false },
    pais: { type: String, required: false },
    telefono: { type: Number, required: false },
    password: { type: String, required: false },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    collection: "Encargado",
  },
);

// Model for interacting with the Encargado collection
const ManagerModel = mongoose.model("Encargado", EncargadoSchema);

export default ManagerModel;

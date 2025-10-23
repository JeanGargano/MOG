import mongoose from 'mongoose';

/**
 * Comedor Schema
 * Represents a comedor with its basic properties:
 */
const ComedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  pais: { type: String, required: true }
}, {
  collection: "Comedor"
});

// Creates the model based on the schema to interact with the database
const ComedorModel = mongoose.model('Comedor', ComedorSchema);

export default ComedorModel;

import axios from "axios";

const backend = "http://localhost:5001";

// Obtener todos los formularios
export const getAll = async () => {
  try {
    const response = await axios.get(`${backend}/getAll`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener formularios:", error);
    throw error;
  }
};

// Obtener un formulario por ID
export const getFormById = async (id) => {
  try {
    const response = await axios.get(`${backend}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el formulario ${id}:`, error);
    throw error;
  }
};

// Guardar una nueva respuesta
export const createForm = async (formData) => {
  try {
    const response = await axios.post(`${backend}/createForm`, formData);
    return response.data;
  } catch (error) {
    console.error("Error al crear formulario:", error);
    throw error;
  }
};

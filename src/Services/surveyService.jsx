const BASE_URL = "https://script.google.com/macros/s/AKfycbyMgIqAy6HH0MVhXGGAKQOvPYs4OU7zt2qDsfDR--kfap7DVAr5xnxoWC-aoiihPUfVhg/exec"; // Reemplaza con tu URL del script

// Obtiene la lista de formularios
export const fetchForms = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Error al obtener la lista de formularios");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en fetchForms:", error);
    throw error;
  }
};

// Obtiene los detalles de un formulario específico
export const fetchFormDetails = async (formId) => {
  try {
    const response = await fetch(`${BASE_URL}?id=${formId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener detalles del formulario ${formId}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en fetchFormDetails:", error);
    throw error;
  }
};

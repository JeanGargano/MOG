const BASE_URL = "https://script.google.com/macros/s/AKfycbx9p00-RPlGBfKAurv8sqXYEWN_qx8g60eM7k8IJcjiU0RF-9Dj8AhB-wQdppYM62L-AA/exec"; 

// Obtiene la lista de formularios
export const fetchForms = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Error al obtener la lista de formularios");
    }
    
    const data = await response.json();
    
    // Guardar en localStorage
    localStorage.setItem("cachedForms", JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error("Error en fetchForms:", error);

    // Intentar recuperar desde localStorage
    const cachedData = localStorage.getItem("cachedForms");
    if (cachedData) {
      console.warn("Modo offline: usando datos guardados.");
      return JSON.parse(cachedData);
    } else {
      throw new Error("No se pudieron obtener los formularios y no hay datos en caché.");
    }
  }
};

// Obtiene los detalles de un formulario específico
export const fetchFormDetails = async (formId) => {
  try {
    const response = await fetch(`${BASE_URL}?id=${formId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener detalles del formulario ${formId}`);
    }
    
    const data = await response.json();
    
    // Guardar en localStorage con clave única por ID
    localStorage.setItem(`cachedForm_${formId}`, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error("Error en fetchFormDetails:", error);

    // Intentar recuperar desde localStorage
    const cachedData = localStorage.getItem(`cachedForm_${formId}`);
    if (cachedData) {
      console.warn(`Modo offline: usando detalles guardados del formulario ${formId}.`);
      return JSON.parse(cachedData);
    } else {
      throw new Error(`No se pudo obtener el formulario ${formId} y no hay datos en caché.`);
    }
  }
};

//Servicio de obtener detalles de un formulario por id
import axios from "axios";

const FORM_DETAILS_CACHE_KEY = "cachedFormDetails";

export const get_by_id = async (formId) => {
  try {
    const response = await axios.get(
      `https://script.google.com/macros/s/AKfycbwho6oeZEaKXqFLZ0eTGqm9AruQCrxvYno_t4M-cgMc7qT-K0H9QP7i9n3KipeYJ8LmiA/exec?id=${formId}`
    );

    // Guardar los detalles del formulario en localStorage
    const cachedForms = JSON.parse(localStorage.getItem(FORM_DETAILS_CACHE_KEY)) || {};
    cachedForms[formId] = response.data;
    localStorage.setItem(FORM_DETAILS_CACHE_KEY, JSON.stringify(cachedForms));

    console.warn(`Detalles del formulario ${formId} obtenidos y guardados en caché`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el formulario ${formId}:`, error);

    // Intentar usar datos en caché
    const cachedForms = JSON.parse(localStorage.getItem(FORM_DETAILS_CACHE_KEY)) || {};
    if (cachedForms[formId]) {
      console.warn(`Modo offline: usando datos guardados para el formulario ${formId}`);
      return cachedForms[formId];
    } else {
      throw new Error(`No se pudo obtener el formulario ${formId} y no hay datos en caché.`);
    }
  }
};

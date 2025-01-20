const BASE_URL = "https://script.google.com/macros/s/AKfycbwaJ4Qa4tRT1ROi5Otz9_Xv0DGCbJatrav2kNrIgsRK3H8tTeQi9SKq0az5PjAA_LCtoA/exec";

export const fetchForms = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error(`Error al obtener formularios: ${response.status}`);
  return await response.json();
};


export const fetchSurveyById = async (formId) => {
  try {
    const response = await fetch(`${BASE_URL}?id=${formId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el formulario: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

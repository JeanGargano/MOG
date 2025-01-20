const BACKEND_URL = ""; 

/**
 * Envía las respuestas del formulario al backend.
 *
 * @param {Object} data - Datos del formulario a enviar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const PostSurvey = async (data) => {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error al enviar los datos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar datos al backend:', error);
    throw error;
  }
};

import axios from "axios";

export const get = async () => {
  try {
    // Hacer la solicitud GET al servidor
    const response = await axios.get(
      "https://script.google.com/macros/s/AKfycbwho6oeZEaKXqFLZ0eTGqm9AruQCrxvYno_t4M-cgMc7qT-K0H9QP7i9n3KipeYJ8LmiA/exec"
    );

    // Guardar los datos en localStorage para uso futuro
    localStorage.setItem("cachedForms", JSON.stringify(response.data));
    console.warn("Se han obtenido los datos")

    // Devolver los datos obtenidos
    return response.data;
  } catch (error) {
    console.error("Error al obtener los formularios:", error);

    // Intentar usar datos en caché si la solicitud falla
    const cachedData = localStorage.getItem("cachedForms");
    if (cachedData) {
      console.warn("Modo offline: usando datos guardados.");
      return JSON.parse(cachedData);
    } else {
      throw new Error("No se pudieron obtener los formularios y no hay datos en caché.");
    }
  }
};
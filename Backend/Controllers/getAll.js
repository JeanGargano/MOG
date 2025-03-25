import axios from "axios";
import fs from "fs";

const cacheFile = "cachedForms.json"; // Archivo donde se guardarán los datos

// Función para guardar en caché
const saveCache = (data) => {
  fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2)); // Guarda en formato JSON bonito
};

// Función para cargar desde la caché
const loadCache = () => {
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  }
  return null;
};

// Servicio para obtener todos los formularios
export const getAll = async () => {
  try {
    const response = await axios.get(
      "https://script.google.com/macros/s/AKfycbwho6oeZEaKXqFLZ0eTGqm9AruQCrxvYno_t4M-cgMc7qT-K0H9QP7i9n3KipeYJ8LmiA/exec"
    );

    saveCache(response.data); // Guarda los datos en un archivo JSON
    console.warn("✅ Datos obtenidos y guardados en caché");

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener los formularios:", error);

    // Intentar usar datos en caché si la solicitud falla
    const cachedData = loadCache();
    if (cachedData) {
      console.warn("⚠️ Modo offline: usando datos guardados en caché.");
      return cachedData;
    } else {
      throw new Error("No se pudieron obtener los formularios y no hay datos en caché.");
    }
  }
};

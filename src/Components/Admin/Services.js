// src/services/encargadoService.js
const API_URL = "http://localhost:5001"; // Ajusta el dominio/puerto si es necesario

export const getEncargado = async (identificacion) => {
  const response = await fetch(
    `${API_URL}/getEncargado?identificacion=${identificacion}`,
  );
  return response.json();
};

export const crearEncargado = async (datos) => {
  const response = await fetch(`${API_URL}/crearEncargado`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return response.json();
};

export const agregarCampos = async (datos) => {
  const response = await fetch(`${API_URL}/agregarCampos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return response.json();
};

export const crearComedor = async (datos) => {
  try {
    const response = await fetch("http://localhost:5001/crear_comedor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const listarComedores = async () => {
  try {
    const response = await fetch("http://localhost:5001/listar_comedores");
    return response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const listarComedoresPorIds = async (ids) => {
  try {
    const response = await fetch("http://localhost:5001/listar_comedor_Id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    return response.json();
  } catch (error) {
    return { error: error.message };
  }
};

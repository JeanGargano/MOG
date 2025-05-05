import React, { createContext, useState, useContext, useEffect } from "react";

// Creación del contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [colaborador, setColaborador] = useState("");
  const [comedor, setComedor] = useState({ nombre: "", pais: "" });
  const [formulariosSeleccionados, setFormulariosSeleccionados] = useState([]);


  // Cargar datos desde localStorage si existen
  useEffect(() => {
    const savedColaborador = localStorage.getItem("colaborador");
    const savedComedor = localStorage.getItem("comedor");
    const savedFormularios = localStorage.getItem("formulariosSeleccionados");

    if (savedColaborador) setColaborador(savedColaborador);
    if (savedComedor) setComedor(JSON.parse(savedComedor));
    if (savedFormularios) setFormulariosSeleccionados(JSON.parse(savedFormularios));
  }, []);


  // Guardar en localStorage cuando cambian
  useEffect(() => {
    if (colaborador) localStorage.setItem("colaborador", colaborador);
    if (comedor && comedor.nombre && comedor.pais) {
      localStorage.setItem("comedor", JSON.stringify(comedor));
    }
    if (formulariosSeleccionados.length > 0) {
      localStorage.setItem("formulariosSeleccionados", JSON.stringify(formulariosSeleccionados));
    }
  }, [colaborador, comedor, formulariosSeleccionados]);


  return (
    <UserContext.Provider value={{ colaborador, setColaborador, comedor, setComedor, formulariosSeleccionados, setFormulariosSeleccionados }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto de usuario
export const useUser = () => useContext(UserContext);

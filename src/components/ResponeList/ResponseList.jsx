import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Usamos Link para redirigir a la página de detalle del formulario
import { fetchForms } from "../../Services/surveyService"; // Supuesto servicio que obtiene formularios

const ResponseList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadForms = async () => {
      try {
        const data = await fetchForms(); // Aquí deberías tener una función que obtenga los formularios
        setForms(data);
      } catch (err) {
        setError("Error al cargar los formularios");
      } finally {
        setLoading(false);
      }
    };
    loadForms();
  }, []);

  return (
    <div className="response-list-container">
      {loading && <p>Cargando formularios...</p>}
      {error && <p>{error}</p>}
      {forms.length === 0 && !loading && <p>No hay formularios disponibles</p>}
      <ul>
        {forms.map((form, index) => (
          <li key={index}>
            <Link to={`/form/${form.id}`} className="form-link">
              {form.name} {/* Suponiendo que cada formulario tiene 'name' y 'id' */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResponseList;

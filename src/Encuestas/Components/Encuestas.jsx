//Lista de Encuestas
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAll } from "../../Services/Services";

const Encuestas = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      try {
        const data = await getAll();
        setForms(data);
      } catch (err) {
        setError("Error al cargar los formularios");
      } finally {
        setLoading(false);
      }
    };
    loadForms();
  }, []);

  const handleFormClick = (formId) => {
    navigate(`/form/${formId}`);
  };

  return (
    <div className="page-container">
      <div className="form-container">
        {loading && <p className="form-message">Cargando...</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && forms.length === 0 && (
          <p className="form-message">No se encontraron formularios.</p>
        )}
        <ul className="form-list">
          {forms.map((form) => (
            <li
              key={form.id}
              className="form-item"
              onClick={() => handleFormClick(form.id)}
            >
              {form.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Encuestas;

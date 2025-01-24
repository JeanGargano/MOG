import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchForms } from "../../Services/surveyService";
import "./FormList.css";

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      try {
        const data = await fetchForms();
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
      <header className="form-header">Movements of Grace</header>
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

export default FormList;

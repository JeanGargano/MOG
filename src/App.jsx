import React, { useState, useEffect } from "react";
import { fetchForms, fetchSurveyById } from "./services/surveyService";

const FormSelector = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await fetchForms();
      setForms(data);
    } catch (err) {
      setError("No se pudieron cargar los formularios.");
    } finally {
      setLoading(false);
    }
  };
  loadForms();
}, []);


  const handleFormClick = async (formId) => {
    try {
      setSurvey(null); // Limpiar el formulario anterior
      setError(null); // Limpiar errores previos
      const data = await fetchSurveyById(formId);
      setSurvey(data);
    } catch (err) {
      setError("No se pudo cargar el formulario seleccionado.");
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Selecciona un formulario</h1>
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            <button onClick={() => handleFormClick(form.id)}>{form.name}</button>
          </li>
        ))}
      </ul>

      {survey && (
        <div>
          <h2>{survey.title}</h2>
          <form>
            {survey.fields.map((field, index) => (
              <div key={index}>
                <label>{field.title}</label>
                <input
                  type={
                    field.type === "TEXT" ? "text" : field.type === "MULTIPLE_CHOICE" ? "radio" : "text"
                  }
                  placeholder={`Ingrese ${field.title}`}
                />
              </div>
            ))}
          </form>
        </div>
      )}
    </div>
  );
};

export default FormSelector;

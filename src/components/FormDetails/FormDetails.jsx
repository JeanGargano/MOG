import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFormDetails } from "../../Services/surveyService";
import "./style.css"; 
import { Post } from "../../Services/Post";

const FormDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const loadFormDetails = async () => {
      try {
        const data = await fetchFormDetails(id);
        setFormDetails(data);

        const initialResponses = data.fields.reduce((acc, field) => {
          acc[field.title] = field.type === "CHECKBOX" ? [] : ""; // Inicializar array para checkboxes
          return acc;
        }, {});
        setResponses(initialResponses);
      } catch (err) {
        setError("Error al cargar el formulario");
      } finally {
        setLoading(false);
      }
    };
    loadFormDetails();
  }, [id]);

  const handleResponseChange = (fieldTitle, value, isCheckbox = false) => {
    setResponses((prev) => {
      if (isCheckbox) {
        const currentValues = prev[fieldTitle];
        return {
          ...prev,
          [fieldTitle]: currentValues.includes(value)
            ? currentValues.filter((val) => val !== value) // Desmarcar si ya está seleccionado
            : [...currentValues, value], // Marcar si no está seleccionado
        };
      }
      return { ...prev, [fieldTitle]: value };
    });
  };

 

  return (
    <div className="container">
      <button onClick={() => navigate("/")}>Volver</button>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && formDetails && (
        <>
          <h1>{formDetails.title}</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            {formDetails.fields.map((field, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <label>{index + 1}. {field.title} ({field.type})</label>
                <br />
                {field.type === "CHECKBOX" ? (
                  field.choices.map((choice, idx) => (
                    <div key={idx}>
                      <label>
                        <input
                          type="checkbox"
                          value={choice}
                          checked={responses[field.title].includes(choice)}
                          onChange={(e) =>
                            handleResponseChange(field.title, e.target.value, true)
                          }
                        />
                        {choice}
                      </label>
                    </div>
                  ))
                ) : field.type === "GRID" ? (
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        {field.columns.map((col, idx) => (
                          <th key={idx}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {field.rows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          <td>{row}</td>
                          {field.columns.map((col, colIdx) => (
                            <td key={colIdx}>
                              <input
                                type="radio"
                                name={`${field.title}-${rowIdx}`}
                                value={col}
                                onChange={(e) =>
                                  handleResponseChange(`${field.title}-${row}`, e.target.value)
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <input
                    type="text"
                    value={responses[field.title]}
                    onChange={(e) => handleResponseChange(field.title, e.target.value)}
                  />
                )}
              </div>
            ))}
            <button 
                type="button" 
                onClick={() => Post(formDetails.title, responses)}
                      >
                  Enviar respuestas
            </button>

          </form>
        </>
      )}
    </div>
  );
};

export default FormDetails;

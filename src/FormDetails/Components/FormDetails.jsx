import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";

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
        const data = await getFormById(id);
        setFormDetails(data);

        const initialResponses = data.fields.reduce((acc, field) => {
          acc[field.title] = field.type === "CHECKBOX" ? [] : "";
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
            ? currentValues.filter((val) => val !== value)
            : [...currentValues, value],
        };
      }
      return { ...prev, [fieldTitle]: value };
    });
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Volver
      </button>

      {loading && <div className="alert alert-info">Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && formDetails && formDetails.fields && (
        <>
          <h1 className="mb-4">{formDetails.title}</h1>
          <form onSubmit={(e) => e.preventDefault()} className="border p-4 rounded shadow bg-light">
            {formDetails.fields.map((field, index) => (
              <div key={index} className="mb-3">
                <label className="form-label">
                  {index + 1}. {field.title} ({field.type})
                </label>

                {field.type === "CHECKBOX" ? (
                  field.choices.map((choice, idx) => (
                    <div key={idx} className="form-check">
                      <input
                        type="checkbox"
                        value={choice}
                        checked={responses[field.title].includes(choice)}
                        className="form-check-input"
                        onChange={(e) => handleResponseChange(field.title, e.target.value, true)}
                      />
                      <label className="form-check-label">{choice}</label>
                    </div>
                  ))
                ) : field.type === "GRID" ? (
                  <table className="table table-bordered mt-2">
                    <thead className="table-light">
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
                                className="form-check-input"
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
                    className="form-control"
                    onChange={(e) => handleResponseChange(field.title, e.target.value)}
                  />
                )}
              </div>
            ))}

            <button type="button" className="btn btn-primary" onClick={() => Post(formDetails.id, formDetails.title, responses)}>
              Enviar respuestas
            </button>

          </form>
        </>
      )}
    </div>
  );
};

export default FormDetails;

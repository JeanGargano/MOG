import React, { useState, useEffect } from 'react';

const DynamicForm = () => {
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});

  // Función para obtener los datos del formulario
  const fetchSurvey = async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw2Yk1g83AgzCAZ5rtuAMH-hLGk3vbQDH7kvSYbLGOgABpC9lV7fLg0aVLbnYRBGZ6n2g/exec');
      const data = await response.json();
      setSurvey(data);
    } catch (error) {
      console.error('Error al obtener el formulario:', error);
    }
  };

  useEffect(() => {
    fetchSurvey();
  }, []);

  const handleInputChange = (fieldTitle, value, fieldType) => {
    if (fieldType === "CHECKBOX") {
      setAnswers(prevAnswers => {
        const currentChoices = prevAnswers[fieldTitle] || [];
        if (currentChoices.includes(value)) {
          return {
            ...prevAnswers,
            [fieldTitle]: currentChoices.filter(item => item !== value)
          };
        } else {
          return {
            ...prevAnswers,
            [fieldTitle]: [...currentChoices, value]
          };
        }
      });
    } else {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [fieldTitle]: value
      }));
    }
  };

  if (!survey) return <p>Cargando formulario...</p>;

  return (
    <div>
      <h1>{survey.title}</h1>
      <form>
        {survey.fields.map((field, index) => {
          if (field.type === "CHECKBOX") {
            return (
              <div key={index}>
                <h3>{field.title}</h3>
                {field.choices.map((choice, idx) => (
                  <div key={idx}>
                    <input
                      type="checkbox"
                      id={`${field.title}-${choice}`}
                      value={choice}
                      checked={answers[field.title]?.includes(choice) || false}
                      onChange={() => handleInputChange(field.title, choice, field.type)}
                    />
                    <label htmlFor={`${field.title}-${choice}`}>{choice}</label>
                  </div>
                ))}
              </div>
            );
          } else if (field.type === "TEXT") {
            return (
              <div key={index}>
                <h3>{field.title}</h3>
                <input
                  type="text"
                  value={answers[field.title] || ''}
                  onChange={(e) => handleInputChange(field.title, e.target.value, field.type)}
                />
              </div>
            );
          }
          return null;
        })}
        <button type="submit">Enviar</button>
      </form>
      <div>
        <h3>Respuestas:</h3>
        <pre>{JSON.stringify(answers, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DynamicForm;

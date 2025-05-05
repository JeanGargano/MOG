import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormById } from "../Services/Services";
import styles from "./Form.module.css";
import Header from "../Header/Index";
import { useUser } from "../../Context/userContext"; // Importa el contexto
import { saveAs } from "file-saver";

const Form = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { colaborador, comedor } = useUser(); // Accede a colaborador y comedor desde el contexto
    const [formDetails, setFormDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [responses, setResponses] = useState({});

    useEffect(() => {
        const loadFormDetails = async () => {
            try {
                const response = await fetch("/Formularios.json");
                if (!response.ok) throw new Error("No se pudo cargar el archivo JSON.");

                const forms = await response.json(); // Convertir a JSON
                console.log("📌 Formularios cargados:", forms); // Verifica los datos

                const foundForm = forms.find((form) => form.id === id);
                console.log("🔍 Formulario encontrado:", foundForm); // Verifica si lo encuentra

                if (!foundForm) throw new Error(`Formulario con ID ${id} no encontrado.`);

                setFormDetails(foundForm);

                // Inicializar respuestas
                const initialResponses = foundForm.fields.reduce((acc, field) => {
                    acc[field.title] = field.type === "CHECKBOX" ? [] : "";
                    return acc;
                }, {});
                setResponses(initialResponses);
            } catch (err) {
                console.error("❌ Error en loadFormDetails:", err);
                setError(`Error al cargar el formulario: ${err.message}`);
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

    const handleSaveAnswers = async () => {
        const answeredForms = JSON.parse(localStorage.getItem("answeredForms")) || [];

        const nuevoEncuestado = {
            fechaRealizacion: new Date().toISOString(),
            nombreCompleto: responses["Nombre completo"] || "Prueba",
            nacionalidad: responses["Nacionalidad"] || "Prueba",
            edad: responses["Edad"] || "Prueba",
            ciudad: responses["Ciudad"] || "Prueba",
            localidad: responses["Localidad"] || "Prueba",
            estrato: responses["Estrato"] || "Prueba",
            preguntas: Object.entries(responses)
                .filter(([key]) =>
                    !["Nombre completo", "Nacionalidad", "Edad", "Ciudad", "Localidad", "Estrato"].includes(key)
                )
                .map(([pregunta, respuesta]) => ({
                    pregunta,
                    respuesta
                }))
        };

        // Buscar formulario existente
        const formIndex = answeredForms.findIndex(f => f.id_formulario === id);

        if (formIndex !== -1) {
            const form = answeredForms[formIndex];

            // Buscar realización con el mismo encargado y comedor
            const realizacionIndex = form.Realizaciones.findIndex(
                r => r.id_encargado === colaborador && r.id_comedor === comedor.nombre
            );

            if (realizacionIndex !== -1) {
                // Si ya existe la realización, añadimos el encuestado
                form.Realizaciones[realizacionIndex].encuestados.push(nuevoEncuestado);
            } else {
                // Si no existe la realización, la creamos
                form.Realizaciones.push({
                    id_encargado: colaborador,
                    id_comedor: comedor.nombre,
                    encuestados: [nuevoEncuestado]
                });
            }
        } else {
            // Si no existe el formulario, lo creamos
            answeredForms.push({
                nombre: formDetails.title,
                Realizaciones: [
                    {
                        id_encargado: colaborador,
                        id_comedor: comedor.nombre,
                        encuestados: [nuevoEncuestado]
                    }
                ],
                id_formulario: id
            });
        }

        // Guardar en localStorage
        localStorage.setItem("answeredForms", JSON.stringify(answeredForms));

        // Guardar estructura actualizada
        localStorage.setItem("answeredForms", JSON.stringify(answeredForms));
        console.log("🧠 Guardado en localStorage:", answeredForms);

        // Lógica para enviar al backend solo esta nueva realización
        try {
            const response = await fetch('http://localhost:5001/writeData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formDetails.title,
                    Realizaciones: [
                        {
                            id_encargado: colaborador,
                            id_comedor: comedor.nombre,
                            encuestados: [nuevoEncuestado]
                        }
                    ],
                    id_formulario: id
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                navigate("/home");
            } else {
                throw new Error(result.error || 'Error al guardar las respuestas en el backend');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Hubo un problema al guardar las respuestas');
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                {loading && <div className={styles.alertInfo}>Cargando...</div>}
                {error && <div className={styles.alertError}>{error}</div>}

                {!loading && formDetails && formDetails.fields && (
                    <>
                        <h1 className={styles.title}>{formDetails.title}</h1>
                        <form onSubmit={(e) => e.preventDefault()} className={styles.formWrapper}>
                            {/* Mostrar colaborador y comedor */}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Colaborador:</label>
                                <p>{colaborador || "No seleccionado"}</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Comedor:</label>
                                <p>
                                    {comedor.nombre && comedor.pais
                                        ? `${comedor.nombre} (${comedor.pais})`
                                        : "No seleccionado"}
                                </p>
                            </div>

                            {formDetails.fields.map((field, index) => (
                                <div key={index} className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        {index + 1}. {field.title} ({field.type})
                                    </label>

                                    {field.type === "CHECKBOX" ? (
                                        field.choices.map((choice, idx) => (
                                            <div key={idx} className={styles.checkboxGroup}>
                                                <input
                                                    type="radio"
                                                    name={`radio-${index}`}
                                                    value={choice}
                                                    checked={responses[field.title] === choice}
                                                    className={styles.radioInput}
                                                    onChange={(e) => handleResponseChange(field.title, e.target.value)}
                                                />
                                                <label>{choice}</label>
                                            </div>
                                        ))
                                    ) : field.type === "GRID" ? (
                                        <table className={styles.table}>
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
                                                                    className={styles.radioInput}
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
                                    ) : field.type === "MULTIPLE_CHOICE" ? (
                                        field.choices.map((choice, idx) => (
                                            <div key={idx} className={styles.checkboxGroup}>
                                                <input
                                                    type="radio"
                                                    name={`radio-${index}`}
                                                    value={choice}
                                                    checked={responses[field.title] === choice}
                                                    className={styles.radioInput}
                                                    onChange={(e) => handleResponseChange(field.title, e.target.value)}
                                                />
                                                <label>{choice}</label>
                                            </div>
                                        ))
                                    ) : field.type === "LIST" ? (
                                        <select
                                            className={styles.textInput}
                                            value={responses[field.title]}
                                            onChange={(e) => handleResponseChange(field.title, e.target.value)}
                                        >
                                            <option value="">Seleccione una opción</option>
                                            {field.choices.map((choice, idx) => (
                                                <option key={idx} value={choice}>
                                                    {choice}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={responses[field.title]}
                                            className={styles.textInput}
                                            onChange={(e) => handleResponseChange(field.title, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                className={styles.submitButton}
                                onClick={handleSaveAnswers}
                            >
                                Enviar respuestas
                            </button>
                        </form>
                    </>
                )}
            </div>
        </>
    );
};

export default Form;

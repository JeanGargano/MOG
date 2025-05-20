import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./Form.module.css";
import Header from "../Header/Index";
import { useUser } from "../../Context/userContext";

const Form = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, comedores } = useUser();
    const [formDetails, setFormDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [responses, setResponses] = useState({
        "Nombre completo": "",
        "Nacionalidad": "",
        "Edad": "",
        "Ciudad": "",
        "Localidad": "",
        "Estrato": ""
    });


    const [comedor, setComedor] = useState(null);

    useEffect(() => {
        const loadComedor = () => {
            try {
                const stored = localStorage.getItem("formulariosSeleccionados");
                if (!stored) return;

                const seleccionados = JSON.parse(stored);
                const comedorNombre = location.state?.comedorNombre;

                const match = seleccionados.find((entry) =>
                    entry.comedor.nombre === comedorNombre &&
                    entry.formularios.some((f) => f.id === id)
                );

                if (match) {
                    setComedor(match.comedor);
                }
            } catch (err) {
                console.error("❌ Error al cargar comedor desde localStorage:", err);
            }
        };

        loadComedor();
    }, [id, location.state]);


    useEffect(() => {
        const loadFormDetails = async () => {
            try {
                const response = await fetch("../../../Backend/Formularios.json");
                if (!response.ok) throw new Error("No se pudo cargar el archivo JSON.");

                const forms = await response.json();
                const foundForm = forms.find((form) => form.id === id);

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
        if (!user || !comedor) {
            alert("Faltan datos del colaborador o comedor.");
            return;
        }

        const nuevoEncuestado = {
            fechaRealizacion: new Date().toISOString(),
            nombreCompleto: responses["Nombre completo"],
            nacionalidad: responses["Nacionalidad"],
            edad: responses["Edad"],
            ciudad: responses["Ciudad"],
            localidad: responses["Localidad"],
            estrato: responses["Estrato"],
            preguntas: Object.entries(responses)
                .filter(([key]) =>
                    !["Nombre completo", "Nacionalidad", "Edad", "Ciudad", "Localidad", "Estrato"].includes(key)
                )
                .map(([pregunta, respuesta]) => ({
                    pregunta,
                    respuesta
                }))
        };

        const nuevoFormulario = {
            nombre: formDetails.title,
            Realizaciones: [
                {
                    id_encargado: user.nombreCompleto || colaborador, // si es objeto o string
                    id_comedor: comedor._id || comedor.nombre,
                    encuestados: [nuevoEncuestado]
                }
            ],
            id_formulario: id
        };

        try {
            const response = await fetch('http://localhost:5001/guardarRespuestaEnArchivo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoFormulario)
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
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Colaborador:</label>
                                <p>{user?.nombreCompleto || "No seleccionado"}</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Comedor:</label>
                                <p>
                                    {comedor
                                        ? `${comedor.nombre} (${comedor.pais})`
                                        : "No seleccionado"}


                                </p>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Nombre completo:</label>
                                <input
                                    type="text"
                                    className={styles.textInput}
                                    value={responses["Nombre completo"]}
                                    onChange={(e) => handleResponseChange("Nombre completo", e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Nacionalidad:</label>
                                <input
                                    type="text"
                                    className={styles.textInput}
                                    value={responses["Nacionalidad"]}
                                    onChange={(e) => handleResponseChange("Nacionalidad", e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Edad:</label>
                                <input
                                    type="number"
                                    className={styles.textInput}
                                    value={responses["Edad"]}
                                    onChange={(e) => handleResponseChange("Edad", e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Ciudad:</label>
                                <input
                                    type="text"
                                    className={styles.textInput}
                                    value={responses["Ciudad"]}
                                    onChange={(e) => handleResponseChange("Ciudad", e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Localidad:</label>
                                <input
                                    type="text"
                                    className={styles.textInput}
                                    value={responses["Localidad"]}
                                    onChange={(e) => handleResponseChange("Localidad", e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Estrato:</label>
                                <input
                                    type="text"
                                    className={styles.textInput}
                                    value={responses["Estrato"]}
                                    onChange={(e) => handleResponseChange("Estrato", e.target.value)}
                                />
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

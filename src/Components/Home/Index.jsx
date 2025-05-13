import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/userContext";
import styles from "./Home.module.css";
import Header from "../Header/Index";

const Home = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { formulariosSeleccionados } = useUser(); // <-- Trae los formularios seleccionados

    useEffect(() => {
        const loadForms = async () => {
            try {
                const response = await fetch("../../../Backend/Formularios.json");
                if (!response.ok) throw new Error("No se pudo cargar el archivo.");
                const data = await response.json();

                // Crear una lista de formularios con su comedor asociado
                const formTitles = formulariosSeleccionados.flatMap(entry =>
                    entry.formularios.map(formSel => {
                        // Buscar el formulario completo en el archivo JSON
                        const fullForm = data.find(f => f.id === formSel.id);
                        return fullForm
                            ? {
                                id: formSel.id,
                                title: fullForm.title,
                                comedorNombre: entry.comedor.nombre
                            }
                            : null;
                    }).filter(Boolean) // Eliminar posibles nulls si algún id no se encuentra
                );

                setForms(formTitles);
            } catch (err) {
                setError("Error al cargar los formularios");
            } finally {
                setLoading(false);
            }
        };

        loadForms();
    }, [formulariosSeleccionados]);


    const handleFormClick = (formId) => {
        navigate(`/form/${formId}`);
    };

    return (
        <>
            <Header />
            <div className={styles.home}>
                <h1 className={styles.title}>FORMULARIOS</h1>
                <div className={styles.pageContainer}>
                    <div className={styles.formContainer}>
                        {loading && <p className={styles.formMessage}>Cargando...</p>}
                        {error && <p className={styles.formError}>{error}</p>}
                        {!loading && forms.length === 0 && (
                            <p className={styles.formMessage}>No tienes formularios seleccionados.</p>
                        )}
                        <ul className={styles.formList}>
                            {forms.map((form) => (
                                <li
                                    key={form.id}
                                    className={styles.formItem}
                                    onClick={() => handleFormClick(form.id)}
                                >
                                    {form.title} – {form.comedorNombre}
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;

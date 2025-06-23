import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./History.module.css";
import Header from "../Header/Index";

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const storedData = localStorage.getItem("respuestas");

                if (!storedData) {
                    alert("⚠️ No hay respuestas guardadas en localStorage.");
                    return;
                }

                const data = JSON.parse(storedData);

                if (!Array.isArray(data) || data.length === 0) {
                    alert("⚠️ No hay respuestas que mostrar en localStorage.");
                    return;
                }

                setHistory(data);
            } catch (error) {
                console.error("Error al cargar respuestas desde localStorage:", error);
                alert("❌ No se pudo cargar la colección de respuestas.");
            }
        };

        fetchAnswers();
    }, []);


    const handleFormClick = (formIndex, realizacionIndex, encuestadoIndex) => {
        navigate(`/form-history/${formIndex}/${realizacionIndex}/${encuestadoIndex}`);
    };


    const handleUpload = async () => {
        try {
            const storedData = localStorage.getItem("respuestas");

            if (!storedData || !storedData.trim()) {
                alert("⚠️ No hay datos válidos guardados en localStorage.");
                return;
            }

            const data = JSON.parse(storedData);

            if (!Array.isArray(data) || data.length === 0) {
                alert("⚠️ La colección de respuestas no tiene formularios válidos.");
                return;
            }

            const uploadResponse = await fetch('http://localhost:5001/migrateData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await uploadResponse.json();

            if (uploadResponse.ok) {
                alert(`✅ ${result.message}\nTotal migradas: ${result.cantidad}`);

                localStorage.removeItem("respuestas");

            } else {
                alert(`❌ Error: ${result.error}`);
            }

            navigate(`/home`);
        } catch (error) {
            console.error('Error al cargar o enviar los datos:', error);
            alert('❌ Error al conectar con el servidor o al leer los datos del localStorage.');
        }
    };

    const totalRealizaciones = history.reduce((acc, form) => {
        return acc + (form.Realizaciones?.reduce((sum, realizacion) => {
            return sum + (realizacion.encuestados?.length || 0);
        }, 0) || 0);
    }, 0);



    return (
        <>
            <Header />
            <div className={styles.tittleAndCounter}>
                <h1 className={styles.mainTitle}>Formularios</h1>
                <h2 className={styles.counter}>Total de realizaciones: {totalRealizaciones}</h2>
            </div>
            <div className={styles.container}>
                {history.length === 0 ? (
                    <p className={styles.emptyMessage}>No hay formularios llenados aún.</p>
                ) : (
                    <ul className={styles.formList}>
                        {history.map((form, formIndex) =>
                            form.Realizaciones?.map((realizacion, realizacionIndex) =>
                                realizacion.encuestados?.map((encuestado, encuestadoIndex) => (
                                    <li key={`${formIndex}-${realizacionIndex}-${encuestadoIndex}`} className={styles.formItem}>
                                        <div>
                                            <h3>{form.nombre}</h3>
                                            <p><strong>Fecha:</strong> {new Date(encuestado.fechaRealizacion).toLocaleString()}</p>
                                            <p><strong>Colaborador:</strong> {realizacion?.id_encargado || "No disponible"}</p>
                                            <p><strong>Comedor:</strong> {realizacion?.id_comedor}</p>
                                        </div>
                                        <button
                                            className={styles.viewButton}
                                            onClick={() => handleFormClick(formIndex, realizacionIndex, encuestadoIndex)}
                                        >
                                            Ver detalles
                                        </button>
                                    </li>
                                ))
                            )
                        )}
                    </ul>
                )}
            </div>
            <div className={styles.uploadContainer}>
                <button className={styles.uploadButton} onClick={handleUpload}>
                    Subir Formularios
                </button>
            </div>
        </>
    );
};

export default History;

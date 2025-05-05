import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./History.module.css";
import Header from "../Header/Index";

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedAnswers = JSON.parse(localStorage.getItem("answeredForms")) || [];
        setHistory(savedAnswers);
    }, []);

    const handleFormClick = (formIndex, realizacionIndex, encuestadoIndex) => {
        navigate(`/form-history/${formIndex}/${realizacionIndex}/${encuestadoIndex}`);
    };


    const handleUpload = async () => {
        try {
            const response = await fetch('http://localhost:5001/migrateData', {
                method: 'POST',
            });

            const result = await response.json();

            if (response.ok) {
                alert(`✅ ${result.message}\nTotal migradas: ${result.cantidad}`);
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error al migrar encuestas:', error);
            alert('❌ Error al conectar con el servidor.');
        }
    };

    // Contar todas las realizaciones
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
                                            <p><strong>Comedor:</strong> {realizacion?.id_comedor?.nombre} ({realizacion?.id_comedor?.pais})</p>
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

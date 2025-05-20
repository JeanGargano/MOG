import React, { useState } from "react";
import {
    crearComedor,
    listarComedores,
    listarComedoresPorIds,
} from "../Services";
import styles from "./CrudComedores.module.css"; // Reusa el mismo CSS

const CrudComedores = () => {
    const [datosCrear, setDatosCrear] = useState({
        nombre: "",
        pais: "",
    });
    const [ids, setIds] = useState("");
    const [resultado, setResultado] = useState(null);

    const manejarCrearComedor = async () => {
        if (!datosCrear.nombre.trim() || !datosCrear.pais.trim()) {
            alert("Por favor completa el nombre y el país antes de crear un comedor.");
            return;
        }
        const res = await crearComedor(datosCrear);
        setResultado(res);
    };


    const manejarListarComedores = async () => {
        const res = await listarComedores();
        setResultado(res);
    };

    const manejarListarPorIds = async () => {
        const arrayIds = ids
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);
        const res = await listarComedoresPorIds(arrayIds);
        setResultado(res);
    };

    const renderResultado = (data) => {
        if (!data) return <p>No hay datos para mostrar.</p>;

        // Si es un array, mostramos una tabla con columnas id, nombre, pais
        if (Array.isArray(data)) {
            if (data.length === 0) return <p>No hay datos para mostrar.</p>;

            return (
                <table className={styles.resultTable}>
                    <thead>
                        <tr>
                            <th className={styles.keyCell}>ID</th>
                            <th className={styles.keyCell}>Nombre</th>
                            <th className={styles.keyCell}>País</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className={styles.valueCell}>{item._id || "N/A"}</td>
                                <td className={styles.valueCell}>{item.nombre || "N/A"}</td>
                                <td className={styles.valueCell}>{item.pais || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        // Si es un objeto simple, mostramos solo las 3 columnas también
        if (typeof data === "object") {
            return (
                <table className={styles.resultTable}>
                    <thead>
                        <tr>
                            <th className={styles.keyCell}>ID</th>
                            <th className={styles.keyCell}>Nombre</th>
                            <th className={styles.keyCell}>País</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.valueCell}>{data._id || "N/A"}</td>
                            <td className={styles.valueCell}>{data.nombre || "N/A"}</td>
                            <td className={styles.valueCell}>{data.pais || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
            );
        }

        return <p>Formato de datos no soportado para mostrar.</p>;
    };


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestor de Comedores</h2>

            <div className={styles.formGroup}>
                <label className={styles.label}>Nombre:</label>
                <input
                    className={styles.input}
                    type="text"
                    value={datosCrear.nombre}
                    onChange={(e) => setDatosCrear({ ...datosCrear, nombre: e.target.value })}
                    placeholder="Ej. Comedor Central"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>País:</label>
                <input
                    className={styles.input}
                    type="text"
                    value={datosCrear.pais}
                    onChange={(e) => setDatosCrear({ ...datosCrear, pais: e.target.value })}
                    placeholder="Ej. Argentina"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Buscar Comedores por IDs (separados por coma):
                </label>
                <input
                    className={styles.input}
                    type="text"
                    value={ids}
                    onChange={(e) => setIds(e.target.value)}
                    placeholder="id1, id2, id3..."
                />
            </div>

            <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={manejarCrearComedor}>
                    Crear Comedor
                </button>
                <button className={styles.button} onClick={manejarListarComedores}>
                    Listar Todos
                </button>
                <button className={styles.button} onClick={manejarListarPorIds}>
                    Buscar por IDs
                </button>
            </div>

            {resultado && (
                <div className={styles.resultContainer}>
                    <h3>Resultado:</h3>
                    {renderResultado(resultado)}
                </div>
            )}
        </div>
    );
};

export default CrudComedores;

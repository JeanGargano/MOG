import { useState } from "react";
import {
    crearComedor,
    listarComedores,
    listarComedoresPorIds,
} from "../Services";
import SelectPaisCiudad from "../../SelectPaisCiudad/Index";
import styles from "./CrudComedores.module.css";

const CrudComedores = () => {
    const [datosCrear, setDatosCrear] = useState({ nombre: "", pais: "" });
    const [ids, setIds] = useState("");
    const [resultado, setResultado] = useState(null);

    const manejarCrearComedor = async () => {
        if (!datosCrear.nombre || !datosCrear.pais) {
            alert("Completa todos los campos.");
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

        const datos = Array.isArray(data)
            ? data
            : data.comedor
                ? [data.comedor]
                : [data];

        const renderFila = (item) => (
            <tr key={item._id}>
                <td className={styles.valueCell}>{item._id || "N/A"}</td>
                <td className={styles.valueCell}>{item.nombre || "N/A"}</td>
                <td className={styles.valueCell}>{item.pais || "N/A"}</td>
            </tr>
        );

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
                    {datos.map(renderFila)}
                </tbody>
            </table>
        );
    };


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestor de Comedores</h2>

            {/* Selector modular de país y ciudad */}
            <div className={styles.formGroup}>
                <SelectPaisCiudad datos={datosCrear} setDatos={setDatosCrear} />

            </div>

            {/* Buscar por IDs */}
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

            {/* Botones */}
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

            {/* Resultado */}
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

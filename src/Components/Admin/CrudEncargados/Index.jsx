import { useState, useEffect } from "react";
import {
    getEncargado,
    crearEncargado,
    agregarCampos,
    listarComedoresPorIds
} from "../Services";
import SeleccionarPais from "../../SelectPaisCiudad/SeleccionarPais/Index";
import styles from "./CrudEncargados.module.css";

const CrudEncargados = () => {
    const [identificacion, setIdentificacion] = useState("");
    const [datos, setDatos] = useState({
        nombreCompleto: "",
        identificacion: "",
        comedores: "",
        pais: "",
        telefono: "",
        contraseña: "",
        isAdmin: false,
    });
    const [resultado, setResultado] = useState(null);
    const [resultadoFormateado, setResultadoFormateado] = useState(null);

    useEffect(() => {
        const procesarResultado = async () => {
            if (resultado && (resultado.result || resultado)._id) {
                const datos = resultado.result || resultado;
                if (Array.isArray(datos.comedores) && datos.comedores.length > 0) {
                    const res = await listarComedoresPorIds(datos.comedores);
                    if (Array.isArray(res) && res.length > 0) {
                        const nombresComedores = res.map(c => c.nombre);
                        const enriquecido = {
                            ...datos,
                            comedores: nombresComedores,
                        };
                        setResultadoFormateado(enriquecido);
                        return;
                    }
                }
                setResultadoFormateado(datos);
            }
        };

        procesarResultado();
    }, [resultado]);

    const manejarGetEncargado = async () => {
        const res = await getEncargado(identificacion);
        setResultado(res);
    };

    const manejarCrearEncargado = async () => {
        const datosConComedores = {
            ...datos,
            comedores: datos.comedores
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean),
        };

        const res = await crearEncargado(datosConComedores);
        setResultado(res);

        if (res?.message === "Encargado creado exitosamente") {
            setIdentificacion("");
            setDatos({
                nombreCompleto: "",
                identificacion: "",
                comedores: "",
                pais: "",
                telefono: "",
                contraseña: "",
                isAdmin: false,
            });
        }
    };


    const manejarAgregarCampos = async () => {
        const datosConComedores = {
            ...datos,
            comedores: datos.comedores
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean),
        };

        const res = await agregarCampos(datosConComedores);
        setResultado(res);
    };

    const renderResultado = (data) => {
        if (!data || typeof data !== "object") {
            return <p>No hay datos para mostrar.</p>;
        }
        const camposExcluir = ["_id", "__v", "contraseña"];
        const resultado = data.result || data;
        const renderFila = (key, value) => (
            <tr key={key}>
                <td className={styles.keyCell}>{key}</td>
                <td className={styles.valueCell}>
                    {Array.isArray(value)
                        ? value.join(", ")
                        : typeof value === "object" && value !== null
                            ? JSON.stringify(value, null, 2)
                            : value?.toString()}
                </td>
            </tr>
        );

        return (
            <table className={styles.resultTable}>
                <thead>
                    <tr>
                        <th className={styles.keyCell}>Clave</th>
                        <th className={styles.keyCell}>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(resultado)
                        .filter(([key]) => !camposExcluir.includes(key))
                        .map(([key, value]) => renderFila(key, value))}
                </tbody>
            </table>
        );
    };


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestor de Encargados</h2>

            <div className={styles.formGroup}>
                <label className={styles.label}>Identificación:</label>
                <input
                    className={`${styles.input} noSpinner`}
                    type="number"
                    value={identificacion}
                    onChange={(e) => {
                        setIdentificacion(e.target.value);
                        setDatos({ ...datos, identificacion: e.target.value });
                    }}
                    onWheel={(e) => e.target.blur()}
                    placeholder="Ej. 123456789"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Nombre Completo:</label>
                <input
                    className={styles.input}
                    type="text"
                    value={datos.nombreCompleto}
                    onChange={(e) => setDatos({ ...datos, nombreCompleto: e.target.value })}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Comedores (separados por coma):</label>
                <input
                    className={styles.input}
                    type="text"
                    value={datos.comedores}
                    onChange={(e) => setDatos({ ...datos, comedores: e.target.value })}
                    placeholder="Ej. comedor1, comedor2"
                />
            </div>

            <div className={styles.formGroup}>
                <SeleccionarPais
                    pais={datos.pais}
                    setPais={(nuevoPais) => setDatos(prev => ({ ...prev, pais: nuevoPais }))}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Teléfono:</label>
                <input
                    className={`${styles.input} noSpinner`}
                    type="number"
                    value={datos.telefono}
                    onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Contraseña:</label>
                <input
                    className={styles.input}
                    type="password"
                    value={datos.contraseña}
                    onChange={(e) => setDatos({ ...datos, contraseña: e.target.value })}
                />
            </div>

            <div className={styles.formGroupCheckbox}>
                <label className={styles.labelCheckbox}>
                    <input
                        type="checkbox"
                        checked={datos.isAdmin}
                        onChange={(e) => setDatos({ ...datos, isAdmin: e.target.checked })}
                    />
                    ¿Es Admin?
                </label>
            </div>

            <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={manejarGetEncargado}>
                    Buscar Encargado
                </button>
                <button className={styles.button} onClick={manejarCrearEncargado}>
                    Crear Encargado
                </button>
                <button className={styles.button} onClick={manejarAgregarCampos}>
                    Agregar Campos
                </button>
            </div>

            {resultado && resultadoFormateado && (
                <div className={styles.resultContainer}>
                    <h3>Resultado:</h3>
                    {renderResultado(resultadoFormateado)}
                </div>
            )}
        </div >
    );
};

export default CrudEncargados;

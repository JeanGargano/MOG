import React, { useEffect, useState } from "react";
import styles from "./SelectPreferences.module.css";
import { useUser } from "../../Context/userContext";
import { useNavigate } from "react-router-dom";

const SelectPreferences = () => {
    const navigate = useNavigate();
    const {
        setColaborador,
        setComedor,
        setFormulariosSeleccionados
    } = useUser();


    const [colaborador, setColaboradorInput] = useState("");
    const [comedorNombre, setComedorNombre] = useState("");
    const [comedorPais, setComedorPais] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [forms, setForms] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadForms = async () => {
            try {
                const response = await fetch("../../../Backend/Formularios.json");
                if (!response.ok) throw new Error("No se pudo cargar el archivo.");
                const data = await response.json();
                const formTitles = data.map(form => ({ id: form.id, title: form.title }));
                setForms(formTitles);
            } catch (err) {
                setError("Error al cargar los formularios");
            } finally {
                setLoading(false);
            }
        };
        loadForms();
    }, []);

    const handleCheckboxChange = (formId) => {
        setSelectedForms(prev =>
            prev.includes(formId)
                ? prev.filter(id => id !== formId)
                : [...prev, formId]
        );
    };

    const handleSave = () => {
        if (!colaborador || !comedorNombre || !comedorPais || selectedForms.length === 0) {
            alert("Por favor completa todos los campos y selecciona al menos un formulario.");
            return;
        }

        setColaborador(colaborador);
        setComedor({ nombre: comedorNombre, pais: comedorPais });
        setFormulariosSeleccionados(selectedForms);
        navigate("/home");
    };

    const filteredForms = forms.filter(form =>
        form.title.toLowerCase() === searchTerm.toLowerCase()
    );

    return (
        <div className={styles.pageContainer}>
            <h2>Seleccionar Preferencias</h2>

            <div className={styles.inputGroup}>
                <label>Colaborador:</label>
                <input
                    type="text"
                    value={colaborador}
                    onChange={(e) => setColaboradorInput(e.target.value)}
                    placeholder="Nombre del colaborador"
                />

                <label>Comedor - Nombre:</label>
                <input
                    type="text"
                    value={comedorNombre}
                    onChange={(e) => setComedorNombre(e.target.value)}
                    placeholder="Nombre del comedor"
                />
                <label>Comedor - País:</label>
                <input
                    type="text"
                    value={comedorPais}
                    onChange={(e) => setComedorPais(e.target.value)}
                    placeholder="País del comedor"
                />


                <label>Buscar Formularios:</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar formularios"
                />
            </div>

            {searchTerm.trim() !== "" && (
                <div className={styles.checkboxList}>
                    {filteredForms.length > 0 ? (
                        filteredForms.map(form => (
                            <label key={form.id} className={styles.checkboxItem}>
                                <input
                                    type="checkbox"
                                    checked={selectedForms.includes(form.id)}
                                    onChange={() => handleCheckboxChange(form.id)}
                                />
                                {form.title}
                            </label>
                        ))
                    ) : (
                        <p>No se encontraron formularios.</p>
                    )}
                </div>
            )}

            <div className={styles.buttonGroup}>
                <button onClick={handleSave}>Guardar</button>
                <button onClick={() => navigate("/")}>Cancelar</button>
            </div>
        </div>
    );
};

export default SelectPreferences;

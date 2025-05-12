import React, { useEffect, useState, useRef } from "react";
import styles from "./SelectPreferences.module.css";
import { useUser } from "../../Context/userContext";
import { useNavigate } from "react-router-dom";

const SelectPreferences = () => {
    const navigate = useNavigate();
    const { setColaborador, setComedor, setFormulariosSeleccionados } = useUser();

    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

    const [colaborador, setColaboradorInput] = useState("");
    const [comedorNombre, setComedorNombre] = useState("");
    const [comedorPais, setComedorPais] = useState("");
    const [selectedForms, setSelectedForms] = useState([]);

    const tokenClient = useRef(null);
    const accessToken = useRef(null);

    useEffect(() => {
        const initializeGapi = async () => {
            await new Promise((resolve) => window.gapi.load("client:picker", resolve));

            await window.gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: [
                    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
                ],
            });

            tokenClient.current = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: "https://www.googleapis.com/auth/drive.readonly",
                callback: (tokenResponse) => {
                    if (tokenResponse.access_token) {
                        accessToken.current = tokenResponse.access_token;
                        openPicker();
                    }
                },
            });
        };

        initializeGapi();
    }, []);

    const openPicker = () => {
        if (!window.google.picker) {
            alert("Google Picker API no está disponible.");
            return;
        }

        const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
        view.setMimeTypes("application/vnd.google-apps.form");

        const picker = new window.google.picker.PickerBuilder()
            .addView(view)
            .setOAuthToken(accessToken.current)
            .setDeveloperKey(API_KEY)
            .setCallback(pickerCallback)
            .setTitle("Selecciona formularios de Google Drive")
            .build();

        picker.setVisible(true);
    };

    const pickerCallback = (data) => {
        if (data.action === window.google.picker.Action.PICKED) {
            const selected = data.docs.map((doc) => ({
                id: doc.id,
                name: doc.name,
            }));
            setSelectedForms(selected);
        }
    };

    const handleOpenDrivePicker = () => {
        if (tokenClient.current) {
            tokenClient.current.requestAccessToken();
        }
    };

    const handleSave = async () => {
        if (!colaborador || !comedorNombre || !comedorPais || selectedForms.length === 0) {
            alert("Por favor completa todos los campos y selecciona al menos un formulario.");
            return;
        }

        setColaborador(colaborador);
        setComedor({ nombre: comedorNombre, pais: comedorPais });
        setFormulariosSeleccionados(selectedForms.map(f => f.id));

        // 🔁 Llama al backend para cada formulario seleccionado
        try {
            const fetchPromises = selectedForms.map((form) =>
                fetch(`http://localhost:5001/getForm?name=${encodeURIComponent(form.name)}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(`Datos recibidos para ${form.name}:`, data);
                        return data;
                    })
            );

            const results = await Promise.all(fetchPromises);
            console.log("Todos los datos:", results);

            // Después de obtener los datos, redirige
            navigate("/home");
        } catch (error) {
            console.error("Error al obtener formularios desde el backend:", error);
        }
    };

    const handleRemoveForm = (formId) => {
        setSelectedForms(prev => prev.filter(form => form.id !== formId));
    };

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

                <label>Seleccionar formulario:</label>
                <button onClick={handleOpenDrivePicker}>
                    Seleccionar formularios desde Drive
                </button>
            </div>

            <div className={styles.inputGroup}>
                {selectedForms.length > 0 && (
                    <ul>
                        {selectedForms.map((form) => (
                            <li key={form.id}>
                                {form.name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveForm(form.id)}
                                    style={{ marginLeft: "10px", color: "red" }}
                                >
                                    Quitar
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.buttonGroup}>
                <button onClick={handleSave}>Guardar</button>
                <button onClick={() => navigate("/")}>Cancelar</button>
            </div>
        </div>
    );
};

export default SelectPreferences;

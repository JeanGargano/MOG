import React, { useEffect, useState, useRef } from "react";
import styles from "./SelectPreferences.module.css";
import { useUser } from "../../Context/userContext";
import { useNavigate } from "react-router-dom";

const SelectPreferences = () => {
    const navigate = useNavigate();
    const {
        user,
        setUser,
        setComedor,
        setFormulariosSeleccionados,
        formulariosPorComedor,
        setFormulariosPorComedor
    } = useUser();

    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

    const [comedoresDisponibles, setComedoresDisponibles] = useState([]);
    const [comedorIdSeleccionado, setComedorIdSeleccionado] = useState("");
    const [comedorPais, setComedorPais] = useState("");

    const comedorSeleccionadoRef = useRef("");

    const tokenClient = useRef(null);
    const accessToken = useRef(null);

    useEffect(() => {
        const initializeGapi = async () => {
            await new Promise((resolve) => window.gapi.load("client:picker", resolve));
            await window.gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
            });
            tokenClient.current = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: "https://www.googleapis.com/auth/drive.readonly",
                callback: (tokenResponse) => {
                    if (tokenResponse.access_token) {
                        accessToken.current = tokenResponse.access_token;
                        openPicker();
                    }
                }
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
            const comedorId = comedorSeleccionadoRef.current;

            if (!comedorId) {
                alert("Error: no se ha seleccionado un comedor.");
                return;
            }

            const selected = data.docs.map((doc) => ({
                id: doc.id,
                name: doc.name,
            }));

            setFormulariosPorComedor((prev) => ({
                ...prev,
                [comedorId]: [
                    ...(prev[comedorId] || []),
                    ...selected.filter(
                        (form) =>
                            !(prev[comedorId] || []).some((f) => f.id === form.id)
                    ),
                ],
            }));
        }
    };

    const handleOpenDrivePicker = () => {
        if (tokenClient.current) {
            tokenClient.current.requestAccessToken();
        }
    };

    useEffect(() => {
        const cargarComedores = async () => {
            if (user?.comedores?.length > 0) {
                try {
                    const response = await fetch("http://localhost:5001/listar_comedor_id", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ids: user.comedores }),
                    });
                    const data = await response.json();
                    setComedoresDisponibles(data);
                } catch (error) {
                    console.error("Error cargando comedores:", error);
                }
            }
        };

        cargarComedores();
    }, [user]);

    useEffect(() => {
        const comedorSeleccionado = comedoresDisponibles.find(c => c._id === comedorIdSeleccionado);
        if (comedorSeleccionado) {
            setComedorPais(comedorSeleccionado.pais);
        } else {
            setComedorPais("");
        }
    }, [comedorIdSeleccionado, comedoresDisponibles]);

    const handleSave = async () => {
        const formulariosSeleccionados = formulariosPorComedor[comedorIdSeleccionado] || [];

        if (!user?.nombreCompleto || !comedorIdSeleccionado || !comedorPais || formulariosSeleccionados.length === 0) {
            alert("Por favor completa todos los campos y selecciona al menos un formulario.");
            return;
        }
        // Guardar en el contexto la estructura completa
        setFormulariosSeleccionados((prev) => {
            // Verifica si ya existe el comedor
            const yaExiste = prev.find(item => item.comedor.id === comedorIdSeleccionado);

            if (yaExiste) {
                // Actualiza los formularios para ese comedor (sin duplicar)
                return prev.map(item => {
                    if (item.comedor.id === comedorIdSeleccionado) {
                        const nuevosFormularios = formulariosSeleccionados.filter(
                            nuevo => !item.formularios.some(existing => existing.id === nuevo.id)
                        );
                        return {
                            ...item,
                            formularios: [...item.formularios, ...nuevosFormularios],
                        };
                    }
                    return item;
                });
            } else {
                // Agrega un nuevo comedor con sus formularios
                return [
                    ...prev,
                    {
                        comedor: {
                            id: comedorIdSeleccionado,
                            nombre: comedoresDisponibles.find(c => c._id === comedorIdSeleccionado)?.nombre || "",
                            pais: comedorPais
                        },
                        formularios: formulariosSeleccionados
                    }
                ];
            }
        });


        try {
            console.log("Formulario seleccionado:", formulariosSeleccionados);
            console.log("Comedor seleccionado:", comedorIdSeleccionado);
            const fetchPromises = formulariosSeleccionados.map((form) =>
                fetch(`http://localhost:5001/getForm?name=${encodeURIComponent(form.name)}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(`Datos recibidos para ${form.name}:`, data);
                        return data;
                    })
            );

            const results = await Promise.all(fetchPromises);
            console.log("Todos los datos:", results);

            navigate("/home");
        } catch (error) {
            console.error("Error al obtener formularios desde el backend:", error);
        }
    };



    const handleRemoveForm = (formId) => {
        setFormulariosPorComedor((prev) => ({
            ...prev,
            [comedorIdSeleccionado]: (prev[comedorIdSeleccionado] || []).filter(
                (form) => form.id !== formId
            ),
        }));
    };

    useEffect(() => {
        comedorSeleccionadoRef.current = comedorIdSeleccionado;
    }, [comedorIdSeleccionado]);


    return (
        <div className={styles.pageContainer}>
            <h2>Seleccionar Preferencias</h2>

            <div className={styles.inputGroup}>
                <label>Colaborador:</label>
                <input type="text" value={user?.nombreCompleto || ""} disabled />

                <label>Comedor:</label>
                <select
                    value={comedorIdSeleccionado}
                    onChange={(e) => setComedorIdSeleccionado(e.target.value)}
                >
                    <option value="">Selecciona un comedor</option>
                    {comedoresDisponibles.map((comedor) => (
                        <option key={comedor._id} value={comedor._id}>
                            {comedor.nombre}
                        </option>
                    ))}
                </select>

                <label>País:</label>
                <input type="text" value={comedorPais} disabled />

                <label>Seleccionar formulario:</label>
                <button onClick={handleOpenDrivePicker}>
                    Seleccionar formularios desde Drive
                </button>
            </div>

            <div className={styles.inputGroup}>
                {Object.entries(formulariosPorComedor).map(([comedorId, formularios]) => {
                    const comedorNombre = comedoresDisponibles.find(c => c._id === comedorId)?.nombre || "Comedor desconocido";
                    return formularios.map((form) => (
                        <li key={form.id}>
                            {form.name} - {comedorNombre}
                            <button
                                type="button"
                                onClick={() => {
                                    setFormulariosPorComedor((prev) => ({
                                        ...prev,
                                        [comedorId]: (prev[comedorId] || []).filter(f => f.id !== form.id),
                                    }));
                                }}
                                style={{ marginLeft: "10px", color: "red" }}
                            >
                                Quitar
                            </button>
                        </li>
                    ));
                })}
            </div>

            <div className={styles.buttonGroup}>
                <button onClick={handleSave}>Guardar</button>
                <button onClick={() => navigate("/")}>Cancelar</button>
            </div>
        </div>
    );
};

export default SelectPreferences;
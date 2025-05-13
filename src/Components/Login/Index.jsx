import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { useUser } from "../../Context/userContext";

const Login = () => {
    const navigate = useNavigate();
    const [identificacion, setIdentificacion] = useState("");
    const [contraseña, setContraseña] = useState("");
    const { setUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identificacion: Number(identificacion),
                    contraseña,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login exitoso:", data);
                setUser(data.encargado)
                navigate("/settings");
            } else {
                alert(data.message || "Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en login:", error);
            alert("Error al conectar con el servidor");
        }
    };


    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        className={styles.inputField}
                        placeholder="Identificación"
                        value={identificacion}
                        onChange={(e) => setIdentificacion(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className={styles.inputField}
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.loginButton}>Ingresar</button>
                </form>
                <a href="#" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
            </div>
        </div>
    );
};

export default Login;

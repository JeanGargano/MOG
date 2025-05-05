import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        navigate("/settings");
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className={styles.inputField}
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className={styles.inputField}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

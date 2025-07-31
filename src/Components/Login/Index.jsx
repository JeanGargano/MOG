import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { useUser } from "../../Context/userContext";
import bcrypt from "bcryptjs";

const Login = () => {
    const navigate = useNavigate();
    const [identificacion, setIdentificacion] = useState("");
    const [contraseña, setContraseña] = useState("");
    const { setUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let onlineFailed = false;

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
                setUser(data.encargado);
                localStorage.setItem("user", JSON.stringify(data.encargado));

                if (data.encargado.isAdmin) {
                    navigate("/crud-encargados");
                } else {
                    navigate("/settings");
                }

                return;
            } else {
                // 🔁 No entramos a modo offline porque sí hubo conexión.
                alert(data.message || "Credenciales incorrectas ffd");
                return;
            }
        } catch (error) {
            console.warn("🛑 No se pudo conectar al servidor. Intentando login offline...");
            onlineFailed = true;
        }

        // ✅ Solo llegas aquí si falló la conexión (modo offline)
        if (onlineFailed) {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                const identificacionMatch = parsedUser.identificacion === Number(identificacion);

                if (!identificacionMatch) {
                    alert("Usuario no encontrado (modo offline)");
                    return;
                }

                const passwordOk = await bcrypt.compare(contraseña, parsedUser.contraseña);

                if (passwordOk) {
                    setUser(parsedUser);

                    if (parsedUser.isAdmin) {
                        navigate("/home");
                    } else {
                        navigate("/home");
                    }
                } else {
                    alert("Contraseña incorrecta (modo offline)");
                }
            } else {
                alert("No hay datos locales para iniciar sesión sin conexión");
            }
        }
    };


    const handleFirstTime = () => {
        navigate("/first-time");
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        className={`${styles.inputField} noSpinner`}
                        placeholder="Identificación"
                        value={identificacion}
                        onChange={(e) => setIdentificacion(e.target.value)}
                        onWheel={(e) => e.target.blur()}
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
                <a className={styles.forgotPassword} onClick={handleFirstTime}>¿Primera vez usando la aplicación?</a>
            </div>
        </div>
    );
};

export default Login;

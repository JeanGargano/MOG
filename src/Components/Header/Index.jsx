import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Button/Index";  // Asegúrate de que el botón está importado correctamente
import styles from "./Header.module.css";

function Header() {
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/home";
    const isntHome = !isHome;

    const handleBack = () => {
        navigate(-1);
    }
    const handleHome = () => {
        navigate("/home");
    }
    const handleHistory = () => {
        navigate("/history")
    }

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Sopas de amor</h1>
            {/* Puedes agregar más botones o elementos aquí */}
            {isHome && (
                <nav className={styles.navbar}>
                    {/* <Button>Home</Button> */}
                    <Button onClick={handleHistory}>Historial</Button>
                    {/* <input type="text" placeholder="Buscar..." /> */}
                </nav>
            )}
            {isntHome && (
                <nav className={styles.navbar}>
                    {/* Aquí puedes agregar un botón para abrir el modal */}
                    <Button onClick={handleHome}>Home</Button>
                    <Button onClick={handleBack}>Volver</Button>
                </nav>
            )}
        </header>
    );
}

export default Header;

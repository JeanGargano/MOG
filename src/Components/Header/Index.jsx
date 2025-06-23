import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Button/Index";
import styles from "./Header.module.css";

function Header() {
    const [isAdmin, setIsAdmin] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/home";
    const isntHome = !isHome;

    useEffect(() => {
        const adminFlag = localStorage.getItem("user");
        const user = adminFlag ? JSON.parse(adminFlag) : {};
        setIsAdmin(user.isAdmin === true);
    }, []);

    const handleBack = () => navigate(-1);
    const handleHome = () => navigate("/home");
    const handleHistory = () => navigate("/history");
    const handleSettings = () => navigate("/settings");

    const handleLogout = () => {
        const confirmLogout = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
        if (confirmLogout) {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
        }
    };

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Sopas de amor</h1>

            <nav className={styles.navbar}>
                {isHome && (
                    <>
                        <Button onClick={handleHistory}>Historial</Button>
                    </>
                )}
                {isntHome && (
                    <>
                        <Button onClick={handleHome}>Home</Button>
                    </>
                )}
                {isAdmin && <Button onClick={handleSettings}>Preferencias</Button>}
                {isAdmin && <Button onClick={() => navigate("/admin")}>Admin</Button>}
                <Button onClick={handleLogout}>Cerrar Sesión</Button>
            </nav>
        </header>
    );
}

export default Header;

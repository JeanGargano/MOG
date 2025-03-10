//Pagina principal del sistema

import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const Home = () => {
    const navigate = useNavigate(); 

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h1 className="display-4 fw-bold text-primary">Sopas de Amor</h1>
                <p className="lead text-secondary">
                    Sistema de gestión de Formularios
                </p>
                <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate("/encuestas")} 
                >
                    Explorar Formularios
                </button>
            </div>
        </div>
    );
};

export default Home;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = (section) => {
    if (section === "formularios") {
      navigate("/formList");
    } else if (section === "respuestas") {
      navigate("/responseList");
    }
  };

  return (
    <div className="page-container">
    <header className="form-header">Movements of Grace</header> <br /> <br /> <br /> <br /> <br /> <br />
      <div className="home-content">
        {/* Versículo */}
        <p className="verse">
          "Más bienaventurado es dar que recibir." - Hechos 20:35
        </p>

        {/* Botones para ver formularios y respuestas */}
        <div className="button-container">
          <button
            className="button"
            onClick={() => handleButtonClick("formularios")}
          >
            Ver Formularios
          </button>
          <button
            className="button"
            onClick={() => handleButtonClick("respuestas")}
          >
            Ver Respuestas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

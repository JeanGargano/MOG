import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home"; 
import FormList from "./components/FormList/FormList"; 
import ResponseList from "./components/ResponeList/ResponseList"; 
import FormDetails from "./components/FormDetails/FormDetails"; // Componente para ver detalles del formulario

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/formList" element={<FormList />} />
      <Route path="/responseList" element={<ResponseList />} />
      <Route path="/form/:id" element={<FormDetails />} />
    </Routes>
  );
};

export default App;

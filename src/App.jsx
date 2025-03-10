import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Components/Home";
import Encuestas from "./Encuestas/Components/Encuestas";
import Login from "./Login/Components/Login";
import Register from "./Register/Components/Register";
import FormDetails from "./FormDetails/Components/FormDetails";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/encuestas" element={<Encuestas />} />
                <Route path="/detalles" element={<FormDetails />} />
            </Routes>
        </Router>
    );
};

export default App;

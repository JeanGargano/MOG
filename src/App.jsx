import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Index"
import Login from "./Components/Login/Index";
import Form from "./Components/Forms/Index";
import ProtectedRoute from "./Components/PrivateRoute/Index"
import History from "./Components/History/Index";
import HistoryForms from "./Components/HistoryForms/index";
import SelectPreferences from "./Components/SelectPreferences/Index";
import Admin from './Components/Admin/Index';
import { UserProvider } from "./Context/userContext";
import './index.css';

const App = () => {

    return (
        // Envolvemos la aplicación con el UserProvider para acceder al contexto global
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />

                    {/* Rutas protegidas para admins */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/settings" element={<SelectPreferences />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/form/:id" element={<Form />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/form-history/:formIndex/:realizacionIndex/:encuestadoIndex" element={<HistoryForms />} />
                        <Route path="/admin" element={<Admin />} />
                    </Route>
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
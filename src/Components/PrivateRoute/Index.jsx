import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAdmin }) => {
    return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function RutaProtegida({ children, rolPermitido }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const tokenExpirado = decoded && decoded.exp * 1000 < Date.now();

    if (tokenExpirado) {
      return <Navigate to="/" replace />;
    }

    if (rolPermitido === "Administrador" && !decoded?.isAdmin) {
      return <Navigate to="/home" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/*
 * RutaProtegida
 * Controla el acceso a las rutas basándose en la validez del token y el rol.
 * Cumple al 100% con las reglas de pureza extrema de React 19 y React Compiler.
 */
function RutaProtegida({ children, rolPermitido }) {
  const token = localStorage.getItem("token");
  const [isAuthValid] = useState(() => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const tokenExpirado = decoded && decoded.exp * 1000 < Date.now();
      return !tokenExpirado;
    } catch {
      return false;
    }
  });

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthValid) {
    return <Navigate to="/" replace />;
  }

  let decoded = null;
  try {
    decoded = jwtDecode(token);
  } catch {
    return <Navigate to="/" replace />;
  }

  if (rolPermitido === "Administrador" && !decoded?.isAdmin) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default RutaProtegida;
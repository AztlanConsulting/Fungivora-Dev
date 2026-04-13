import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/First_Page.css";

import { HugeiconsIcon } from "@hugeicons/react";
import { Logout02Icon } from "@hugeicons/core-free-icons";

function First_Page() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  let rol = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      rol = decoded.rol; 
    } catch (error) {
      console.error("Token inválido");
    }
  }

  return (
    <div className="container">
      <h1>Pagina principal</h1>

      <p>Bienvenidx</p>

      {/* Boton permitido solo para el Administrador */}
      {rol === "Administrador" && (
        <button
          onClick={() => {
            navigate("/usuario"); 
          }}
        >
          Registro de Usuarios
        </button>
      )}

      {/* Boton para cerrar sesión y destruir el token */}
      <button onClick={handleLogout} className="logout-btn">
        <HugeiconsIcon 
          icon={Logout02Icon} 
          className="logout-icon"
          color="#3b3fb6" 
        />
      </button>
    </div>
  );
}

export default First_Page;

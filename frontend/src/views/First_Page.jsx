import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function First_Page() {
  const rol = localStorage.getItem("rol");
  const navigate = useNavigate();

  return (
    <div>
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
    </div>
  );
}

export default First_Page;
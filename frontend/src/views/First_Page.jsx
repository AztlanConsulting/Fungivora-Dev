import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


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

  console.log("TOKEN:", token);
  console.log("DECODE:", jwtDecode(token));

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
      <br></br>
      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default First_Page;
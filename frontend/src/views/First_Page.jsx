import { useEffect, useState } from "react";

function First_Page() {
  const rol = localStorage.getItem("rol");

  return (
    <div>
      <h1>Pagina principal</h1>

      <p>Bienvenidx</p>

      {/* SOLO ADMIN */}
      {rol === "Administrador" && (
        <button
          onClick={() => {
            fetch("http://localhost:5000/usuario", {
              method: "GET",
              headers: {
                "rol": rol,
              },
            });
          }}
        >
          Registro de Usuarios
        </button>
      )}
    </div>
  );
}

export default First_Page;
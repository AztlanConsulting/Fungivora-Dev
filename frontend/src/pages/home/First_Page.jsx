import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./First_Page.css";

import { HugeiconsIcon } from "@hugeicons/react";
import { Logout02Icon } from "@hugeicons/core-free-icons";

import Button from "../../shared/components/ui/buttons/botones";
import ModalConfirmacion from "../../shared/components/ui/popups/modal_confirmacion";

function First_Page() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    const confirmacion = window.confirm("¿Confirmar cierre de sesión?");

    if (confirmacion) {
      localStorage.removeItem("token");
      navigate("/");
    }
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
      <button onClick={() => setShowModal(true)} className="logout-btn">
        <HugeiconsIcon
          icon={Logout02Icon}
          className="logout-icon"
          color="#3b3fb6"
        />
      </button>

      <ModalConfirmacion
        visible={showModal}
        mensaje="¿Confirmar cierre de sesión?"
        onConfirm={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}

export default First_Page;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Componentes de UI e Icons
import ModalConfirmacion from "../../shared/components/ui/popups/modal_confirmacion";
import Titulo from "../../shared/components/ui/basics/titulo"; 
import Base from "../../shared/components/layout/base"; 

function First_Page() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  // Decodificación del rol (opcional por si lo necesitas en el render)
  let rol = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      rol = decoded.rol;
    } catch (error) {
      console.error("Token inválido");
    }
  }

  const confirmarCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      <div className="flex-1 flex flex-col">
        {/* Encabezado fijo con el nombre de la vista */}
        <Titulo>Inicio</Titulo>

        {/* Contenedor con padding y scroll para el contenido real */}
        <Base margen_arriba="mt-24 md:mt-32">
          {/* Aquí va el contenido de tu página */}
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Bienvenidx a Fungivora</h2>
            
            {/* Ejemplo de botón que dispara el modal (si no usas el de la navbar) */}
            <button 
              onClick={() => setShowModal(true)}
              className="mt-10 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Cerrar sesión manualmente
            </button>
          </div>
        </Base>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion
        visible={showModal}
        mensaje="¿Confirmar cierre de sesión?"
        onConfirm={confirmarCerrarSesion}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}

export default First_Page;
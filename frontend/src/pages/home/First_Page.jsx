import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Componentes de UI e Icons
import ModalConfirmacion from "../../shared/components/ui/popups/modal_confirmacion";
import Titulo from "../../shared/components/ui/basics/titulo"; 
import Text from "../../shared/components/ui/basics/texto"; 
import Base from "../../shared/components/layout/base"; 

function First_Page() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  // Decodificación del rol
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
    <div className="min-h-screen">
      <Titulo>Pagina Principal</Titulo>
      
      <div className="flex flex-col">
        <Base margen_arriba="mt-20 md:mt-24" margen_abajo="mb-20 md:mb-10">
          <div className="w-full max-w-4xl">
            <Text variante="medium">Bienvenidx a Fungivora</Text>
            
            <button 
              onClick={() => setShowModal(true)}
              className="mt-10 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Cerrar sesión manualmente
            </button>
          </div>
        </Base>
      </div>

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
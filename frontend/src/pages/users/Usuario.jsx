import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../features/user/hooks/useUsuario';
import TablaUsuarios from "../../features/user/components/TablaUsuarios"; 
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/Titulo";
import ModalConfirmacion from "../../shared/components/ui/popups/modal_confirmacion";
import ModalAlerta from "../../shared/components/ui/popups/ModalAlerta";
import { CancelCircleIcon } from '@hugeicons/core-free-icons';
import Button from "../../shared/components/ui/buttons/botones";

//Toma todos los datos del usuario para la tabla
const Usuario = () => {
  const { listaUsuarios, esAdmin, cargando, idUsuarioActual, borrarUsuario } = useUsuario();

  //se encarga de la redirecion a la home
  const navigate = useNavigate();
  useEffect(() => {
    if (!cargando && !esAdmin){
      navigate('/first');
    }
  }, [cargando, esAdmin, navigate]);

  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  //Maneja el estado de las alertas
  const [alerta, setAlerta] = useState({ visible: false, variante: "exito", mensaje: "" });

  //Alrta de exito 
  const mostrarAlerta = (variante, mensaje) => {
    setAlerta({ visible: true, variante, mensaje})
  }

  //Alerta de error
  const cerrarAlerta = () => {
    setAlerta({ visible: false, variante: "exito", mensaje: ""})
  }

  //Alerta de no eliminarse a uno mismo
  const solicitarEliminar = (id_usuario) => {
    if (id_usuario === idUsuarioActual){
      mostrarAlerta("advertencia", "No te puedes eliminar a ti mismo")
      return;
    }
    setUsuarioAEliminar(id_usuario);
  };

  //estado del modal si decides no borrar
  const cancelarEliminar = () => {
    setUsuarioAEliminar(null);
  };

  //Estado del modal si decides borrar
  const confirmarEliminar = async () => {
    try{
    await borrarUsuario(usuarioAEliminar);
    mostrarAlerta("exito", "El Usuario se elimino correctamente");
    } catch (error){
      mostrarAlerta("error", error.message);
    } finally{
    setUsuarioAEliminar(null);
    }
  };

  //estado de carga
  if (cargando) {
    return (
      <Base margen_arriba="mt-8 md:mt-[vh]">
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-xl font-semibold text-gray-500">Cargando sistema...</p>
        </div>
      </Base>
    );
  }

  //Se encarga de manejar lo que hace el boton
  const handleAgregar = () => {
    //Llevara a la vista de registro de usuario
};

  return (
    <Base margen_arriba="mt-8 md:mt-[vh]">
      <Titulo>Usuarios</Titulo>

      <div className="bg-white rounded-2xl p-8 shadow-sm w-full min-h-[70vh] flex flex-col mt-6">
        <TablaUsuarios 
          datos={listaUsuarios} 
          esAdmin={esAdmin} 
          colorBordeHeader="#e2e8f0" 
          onEliminar={solicitarEliminar} 
        />

      </div>

      <ModalConfirmacion
        visible={usuarioAEliminar !== null}
        titulo="¿Eliminar usuario?"
        descripcion="Esta acción no se puede deshacer. El usuario será eliminado permanentemente."
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        icon={CancelCircleIcon}
        onConfirm={confirmarEliminar}
        onCancel={cancelarEliminar}
      />

      <ModalAlerta
        visible={alerta.visible}
        variante={alerta.variante}
        mensaje={alerta.mensaje}
        onClose={cerrarAlerta}
      />

      <div className="flex justify-center mt-10">
        <Button variant="agregar" onClick={handleAgregar}>
          Agregar
        </Button>
      </div>

    </Base>
  );
};

export default Usuario;
import React, { useState, useEffect } from "react";
import Titulo from "../../shared/components/ui/basics/titulo";
import Base from "../../shared/components/layout/base";
import Text from "../../shared/components/ui/basics/texto";
import Input from "../../shared/components/ui/inputs/input_texto";
import Button from "../../shared/components/ui/buttons/botones";
import ModalConfirmacion from "../../shared/components/ui/popups/modal_confirmacion";
import AlertaError from "../../shared/components/ui/basics/error";
import { useNavigate } from "react-router-dom";

const RegistrarUsuario = () => {

//Estados de los imputs, tambien permite que no se vea la contraseña Y LA NAVEGACION DE LOS BOTONES
const [valusuario, setValusuario] = useState("");
const [valcorreo, setValcorreo] = useState("");
const [valcontrasena, setValcontrasena] = useState("");
const [valverifica, setValverifica] = useState("");
const navigate = useNavigate();
const [accionPendiente, setAccionPendiente] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [error, setError] = useState("");

useEffect(() => {

  //Verifica el usuario si es admin y restringe su acceso
  //Asistencia de la IA para entender y como implementar estructuracion
  const verificarAdmin = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No eres un usuario, redirigiendo a login")
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try{
      const response = await fetch("/api/usuario/registrar_usuario",{
        method: "GET",
        headers: { "Authorization": token},
        cache: "no-store",
      });
    
    const data = await response.json();

    if (data.msg !== "Autorizado"){
      setError("No eres un usuario autorizado, redirigiendo a login")
      setTimeout(() => navigate("/login"), 2000);
    }
    } catch(err){
      console.error("Error al verificar permisos", err);
      setError("Error de conexion, vuelva a iniciar seccion");
      setTimeout(() => navigate("/login"), 2000);
      }
    };
    verificarAdmin();
}, []);

//Handle del registro de usario y sus errores
const handleRegistrarClick = () => {

  // Validación: que no estén vacías
  if ((!valusuario || !valcorreo || !valcontrasena || !valverifica)) {
    setError("Llena todos los campos.");
    return;
  }

   // Validación: de carecteres en correo
  if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(valcorreo)) {
    setError("Inserte un correo valido (ejemplo: ejemplo@mail.com).");
    return;
  }

  // Validación: no se esta usando espacios en contrseñas
 if (/\s/.test(valcontrasena) || /\s/.test(valverifica)) {
    setError("La contraseña no puede contener espacios");
    return;
  }

  // Validación: no se esta usando espacios innecesarios y de caracteres en usuario
  if (!/^[\p{L}\p{N}]+([ ][\p{L}\p{N}]+)*$/u.test(valusuario)) {
    setError("El usuario solo puede contener letras o números, sin espacios al inicio o final")
    return;
  }

  //Validación: de carecteres en contrasenas
  if (!/^[a-zA-Z0-9]+$/.test(valcontrasena)) {
    setError("La contraseña solo puede contener letras y números.");
    return;
  }

  // Validación: de limite de contraseñas
  if (valcontrasena.length > 20){
    setError("La contraseña no puede superar 20 caracteres.");
    return;
  }

  // Validación: De contraseñas iguales
  if (valcontrasena !== valverifica) {
    setError("Las contraseñas no coinciden, verifica que sean iguales.");
    return;
  }

  setError("");
  setAccionPendiente("registrar");
  setIsModalOpen(true);
};

//Handle de cancelar el registro
const handleCancelarClick = () => {
  setAccionPendiente("cancelar");
  setIsModalOpen(true);
};

//Handle de la confirmacion y la conexcion 
const handleConfirm = async () => {
  setIsModalOpen(false); 

  if (accionPendiente === "cancelar"){
    setAccionPendiente(null);
    navigate("/usuario")
    return;
  }

 try{

  //se encarga de mandar el post

  const token = localStorage.getItem("token");
  const response = await fetch("/api/usuario/anadir", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": token,
      cache: "no-store"
    },
    body: JSON.stringify({

      nombre_usuario: valusuario,
      correo_usuario: valcorreo,
      contrasena: valcontrasena,
    }),
  });
  //Respuesta de la db y si fue exitosa o no
  const data = await response.json();

  if (data.msg === "No autorizado" || data.msg === "Token inválido") {
    setError("No eres un usuario autorizado vuelva a iniciar sesion");
    setAccionPendiente(null);
    navigate("/login");
    return
  }

  if (!response.ok) {
    setError(data.msg);
    setAccionPendiente(null)
    return;
  }

  setAccionPendiente(null);
  navigate("/usuario");
} catch (err) {
  console.error("error de red", err);
  setError("Hubo un error con la conexion, intenta otra vez");
  setAccionPendiente(null)
}

};

  return (
    <Base margen_arriba="mt-8 md:mt-[vh]">
      <Titulo>Crear Usuario</Titulo>

    <div className="bg-white rounded-2xl p-8 shadow-sm w-full min-h-[70vh] flex flex-col mt-6">

     {/* INPUTS del usuario, estructura general de tanto el nombre, correo y contraseña*/}
     {/* Solo se uso IA para ayudar con las clases de Tailwind, como los flex, gaps, etc*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* INPUT del nombre del usuario*/}
          <div className="flex flex-col gap-1 min-w-0">
            <span>Usuario</span>
            <Input 
                variante="normal" 
                placeholder="Escribe tu usuario..." 
                className="!w-full"
                value={valusuario} 
                onChange={(e) => setValusuario(e.target.value)} />
          </div>
        {/* INPUT del Correo electronico del usuario*/}
          <div className="flex flex-col gap-1 min-w-0">
            <span>Correo Electronico</span>
            <Input 
                variante="normal"
                className="!w-full"
                placeholder="Escribe un correo (correo@mail.com)..." 
                value={valcorreo} 
                onChange={(e) => setValcorreo(e.target.value)} />
          </div>

        {/* INPUT de la contrasena del usuario*/}
        <div className="flex flex-col gap-1 gap-1 min-w-0">
            <span>Contraseña</span>
        <Input 
            type="password" 
            className="!w-full"
            placeholder="Escribe una contraseña..." 
            autoComplete="new-password" 
            value={valcontrasena} 
            onChange={(e) => {
            setValcontrasena(e.target.value);
            if (error) setError("");
        }} />
        </div>

        <div className="flex flex-col gap-1 gap-1 min-w-0">
            <span>Confirmar Contraseña</span>
            <Input 
            type="password" 
            className="!w-full"
            placeholder="Escribe otra vez tu contraseña..." 
            autoComplete="new-password" 
            value={valverifica} 
            onChange={(e) => {
            setValverifica(e.target.value);
            if (error) setError("");
            }} />
        </div>  

    </div>
    
     {/* Mensaje de error*/}
    <AlertaError detalle={error} />

    {/* Botones de registro y cancelar*/}
    <div className="flex justify-end gap-2 mt-auto">
        <div className="flex justify-end gap-2 mt-8">
            <Button 
                variant="registrar" 
                isOutline={true} 
                onClick={handleRegistrarClick}>
            Registrar
            </Button>

            <Button 
                variant="cancelar" 
                onClick={handleCancelarClick}>
            Cancelar
            </Button>
        </div>
    </div>

    {/* Modulo del pop up de confirmar*/}
    <ModalConfirmacion
        visible={isModalOpen}
        titulo="¿Confirmar Registro?"
        descripcion="Si confirmas se guardaran todos los datos como estan."
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
        textoConfirmar="Confirmar"
    >
    </ModalConfirmacion>
    </div>
    </Base>
  );
};

export default RegistrarUsuario;
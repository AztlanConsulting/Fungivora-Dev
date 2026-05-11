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
const [verificando, setVerificando] = useState(true);

useEffect(() => {

  //Verifica el usuario si es admin y restringe su acceso
  //Asistencia de la IA para entender y como implementar estructuracion
  const verificaAdmin = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true})
      return;
    }

    try {
      const response =await fetch("/api/usuario/registrar_usuario", {
        method: "GET",
        headers: { "Authorization": token},
        cache: "no-store",
    });

    const data = await response.json();

    if(data.msg !== "Autorizado"){
      navigate("/first", { replace: true });
      return;
    }
    setVerificando(false);

    }
    catch (err) {
      console.error("Error al verificar permisos", err);
      localStorage.removeItem("token");
    navigate("/login", { replace: true });
      }
    };
    verificaAdmin();
  }, [navigate]);


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
  if (!/^[a-zA-Z0-9ñÑ]+$/.test(valcontrasena)) {
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

  if (data.msg === "Token inválido") {
    setAccionPendiente(null);
    localStorage.removeItem("token");
    navigate("/login");
    return
  }

  if (data.msg === "No autorizado"){
    setAccionPendiente(null);
    navigate("/first", { replace: true });
    return;
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

 if (verificando){
  return null
 }

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
    {/* Asistencia de la IA para comandos especificos de Tailwind como los md, [&_button], entre otros*/}
<div className="flex flex-col items-stretch md:flex-row md:items-stretch md:justify-end gap-3 mt-auto pt-8 [&_button]:w-full max-md:[&_button]:py-5 md:[&_button]:w-auto md:[&_button]:min-w-[180px]">    
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
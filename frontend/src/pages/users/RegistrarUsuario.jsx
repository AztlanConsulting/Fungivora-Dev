import React from "react";
import Titulo from "../../shared/components/ui/basics/titulo";
import Base from "../../shared/components/layout/base";
import Input from "../../shared/components/ui/inputs/input_texto";
import Button from "../../shared/components/ui/buttons/botones";
import ModalConfirmacion from "../../shared/components/ui/popups/modal_confirmacion";
import AlertaError from "../../shared/components/ui/basics/error";
import useRegistrarUsuario from "../../features/user/hooks/useRegistrarUsuario";

//llama a todos los datos, estados y servicos de la vista
const RegistrarUsuario = () => {
  const {
    valusuario, setValusuario,
    valcorreo, setValcorreo,
    valcontrasena, setValcontrasena,
    valverifica, setValverifica,
    error, setError,
    isModalOpen,
    verificando,
    handleRegistrarClick,
    handleCancelarClick,
    handleConfirm,
    handleCancelarModal,
  } = useRegistrarUsuario();

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
        onCancel={handleCancelarModal}
        textoConfirmar="Confirmar"
    >
    </ModalConfirmacion>
    </div>
    </Base>
  );
};

export default RegistrarUsuario;
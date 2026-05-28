import React, { useState } from "react"; 
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import Button from "../../../shared/components/ui/buttons/Botones";
import Input from "../../../shared/components/ui/inputs/InputTexto";

import { HugeiconsIcon } from '@hugeicons/react';
import { ViewOffIcon, ViewIcon } from '@hugeicons/core-free-icons';

const FormCrearUsuario = ({
  nuevoUsuario,
  setNuevoUsuario,
  onGuardar,
  cargando,
  error,
  setError
}) => {
  // Estado booleano para alternar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeInput = (campo, valor) => {
    if (error && setError) setError(null);

    setNuevoUsuario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nombre_usuario, correo_usuario, contrasena_usuario } = nuevoUsuario;
    if (!nombre_usuario?.trim() || !correo_usuario?.trim() || !contrasena_usuario?.trim()) {
      if (setError) setError("Por favor, llena todos los datos.");
      return;
    }

    if (nombre_usuario.length > 25) {
      if (setError) setError("El nombre de usuario no puede exceder los 25 caracteres.");
      return;
    }

    if (correo_usuario.length > 25) {
      if (setError) setError("El correo electrónico no puede exceder los 25 caracteres.");
      return;
    }

    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    if (!regexCorreo.test(correo_usuario)) {
      if (setError) setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    const longitudContrasena = contrasena_usuario ? contrasena_usuario.length : 0;
    if (longitudContrasena < 8 || longitudContrasena > 16) {
      if (setError) setError("La contraseña debe tener entre 8 y 16 caracteres.");
      return;
    }

    onGuardar();
  };

      const inputContainerClasses = "flex flex-col gap-2 w-full";

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-5 max-w-md mx-auto w-full px-2 sm:px-0"
      autoComplete="none"
      noValidate 
    >
      <div style={{ display: 'none' }} aria-hidden="true">
        <input type="text" name="username" tabIndex="-1" autoComplete="username" />
        <input type="email" name="email" tabIndex="-1" autoComplete="email" />
        <input type="password" name="password" tabIndex="-1" autoComplete="new-password" />
      </div>

      <div className="mb-1 justify-center">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>
          Crear usuario
        </Text>
      </div>

     {/* Nombre de Usuario */}
    <div className={inputContainerClasses}>
      <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Nombre de usuario</Text>
      <Input
        type="text"
        className="w-full"
        placeholder="Escribe un usuario"
        value={nuevoUsuario.nombre_usuario || ""}
        onChange={(e) => handleChangeInput("nombre_usuario", e.target.value)}
        required
        maxLength={25}
      />
    </div>

    {/* Correo Electrónico */}
    <div className={inputContainerClasses}>
      <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Correo Electrónico</Text>
      <Input
        type="email"
        className="w-full"
        placeholder="Escribe un correo"
        value={nuevoUsuario.correo_usuario || ""}
        onChange={(e) => handleChangeInput("correo_usuario", e.target.value)}
        required
        maxLength={25}
      />
    </div>

    {/* Contraseña con el ojito integrado */}
    <div className={inputContainerClasses}>
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Contraseña</Text>
        
        <div className="relative w-full">
            <Input
                type={showPassword ? "text2" : "password"} 
                placeholder="Escribe una contraseña"
                value={nuevoUsuario.contrasena_usuario || ""}
                onChange={(e) => handleChangeInput("contrasena_usuario", e.target.value)}
                required
                maxLength={16}
                className="w-full pr-10" 
            />
            
            <div
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer select-none z-20 text-gray-500 hover:text-gray-700 h-5 w-5"
                onClick={() => setShowPassword(!showPassword)}
            >
                <HugeiconsIcon
                    icon={showPassword ? ViewIcon : ViewOffIcon}
                    size={20}
                />
            </div>
        </div>
    </div>
      
      {error && (
        <div className="text-center mt-2 p-3 rounded-xl animate-in fade-in duration-200">
          <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{error}</Text>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-center pt-4 w-full">
        <Button 
          variant="primario" 
          className="w-full sm:max-w-[200px]" 
          type="submit"
          disabled={cargando}
        >
          {cargando ? "Creando..." : "Crear Usuario"}
        </Button>
      </div>
    </form>
  );
};

export default FormCrearUsuario;
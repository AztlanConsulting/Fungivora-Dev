import React, { useState } from "react"; 
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import Button from "../../../shared/components/ui/buttons/Botones";
import Input from "../../../shared/components/ui/inputs/InputTexto";

const FormCrearUsuario = ({
  nuevoUsuario,
  setNuevoUsuario,
  onGuardar,
  onCancelar,
  cargando,
  error,
  setError
}) => {
  const [tipoContrasena, setTipoContrasena] = useState("text");

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
      if (setError) setError("Todos los campos son obligatorios. Por favor, llena todos los datos.");
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
      if (setError) setError("El correo electrónico no tiene un formato válido (ejemplo@dominio.com).");
      return;
    }

    const longitudContrasena = contrasena_usuario ? contrasena_usuario.length : 0;
    if (longitudContrasena < 8 || longitudContrasena > 16) {
      if (setError) setError("La contraseña debe tener entre 8 y 16 caracteres.");
      return;
    }

    onGuardar();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-5 max-w-md mx-auto w-full px-2 sm:px-0"
      autoComplete="off"
      noValidate 
    >
      <div className="mb-1">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>
          Datos de la Cuenta
        </Text>
      </div>

      {/* Nombre de Usuario */}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Nombre de usuario</Text>
        <Input
          type="text"
          style={{ fontStyle: 'italic' }}
          placeholder="Ej. JuanPerez"
          value={nuevoUsuario.nombre_usuario || ""}
          onChange={(e) => handleChangeInput("nombre_usuario", e.target.value)}
          required
          autoComplete="new-username"
          maxLength={25}
        />
      </div>

      {/* Correo Electrónico */}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Correo Electrónico</Text>
        <Input
          type="email"
          inputMode="email"
          style={{ fontStyle: 'italic' }}
          placeholder="correo@devora.com"
          value={nuevoUsuario.correo_usuario || ""}
          onChange={(e) => handleChangeInput("correo_usuario", e.target.value)}
          required
          autoComplete="new-email"
          maxLength={25}
        />
      </div>

      {/* Contraseña */}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Contraseña</Text>
        <Input
          type={tipoContrasena}
          style={{ fontStyle: 'italic' }}
          placeholder="••••••••"
          value={nuevoUsuario.contrasena_usuario || ""}
          onChange={(e) => {
            handleChangeInput("contrasena_usuario", e.target.value);
            if (tipoContrasena === "text") setTipoContrasena("password");
          }}
          onFocus={() => setTipoContrasena("password")}
          required
          autoComplete="new-password"
          maxLength={16}
        />
      </div>
      
      {error && (
        <div className="text-center mt-2 p-3 rounded-xl animate-in fade-in duration-200">
          <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{error}</Text>
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          variant="cancelar" 
          isOutline={true} 
          className="w-full order-2 sm:order-1" 
          onClick={onCancelar}
          type="button"
          disabled={cargando}
        >
          Cancelar
        </Button>
        <Button 
          variant="primario" 
          className="w-full order-1 sm:order-2" 
          type="submit"
          disabled={cargando}
        >
          {cargando ? "Registrando..." : "Guardar Usuario"}
        </Button>
      </div>
    </form>
  );
};

export default FormCrearUsuario;
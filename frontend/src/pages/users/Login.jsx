import React, { useState } from "react";
import Input from "../../shared/components/ui/inputs/InputTexto";
import Button from "../../shared/components/ui/buttons/Botones";
import Text from "../../shared/components/ui/basics/Texto";
import { colores } from "../../shared/components/ui/basics/Colores";

import fondoEscritorio from "../../assets/images/fondo-fungivora.png";
import fondoMovil from "../../assets/images/fondo-fungivora-plano.png";

import { HugeiconsIcon } from '@hugeicons/react';
import { ViewOffIcon, ViewIcon, User03Icon, Key01Icon } from '@hugeicons/core-free-icons';
import useLogin from "../../features/login/hooks/useLogin";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { ejecutarLogin, cargando, error, limpiarError } = useLogin();

  const handleUsuarioChange = (e) => {
    const valor = e.target.value;
    if (valor.length <= 30) {
      setUsuario(valor);
      if (error) limpiarError();
    }
  };

  const handlePasswordChange = (e) => {
    const valor = e.target.value;
    if (valor.length <= 30) {
      setPassword(valor);
      if (error) limpiarError();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const resultado = await ejecutarLogin(usuario, password);
    if (resultado) {
      window.location.href = "/home";
    }
  };
  const autofillClasses = "autofill:shadow-[0_0_0_1000px_#eff6ff_inset] transition-colors duration-5000";

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Fondo */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover md:bg-[image:var(--bg-desktop)] bg-[image:var(--bg-movil)]"
        style={{
          "--bg-movil": `url(${fondoMovil})`,
          "--bg-desktop": `url(${fondoEscritorio})`,
          backgroundPosition: "center"
        }}
      />

      {/* Formulario */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-lg rounded-[2rem] sm:rounded-[3rem] bg-white p-6 sm:p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col items-center">
          <form onSubmit={handleLogin} className="flex flex-col items-center w-full">

            {/* Títulos */}
            <div className="w-full text-center mb-8 sm:mb-10">
              <Text variante="title" style={{ color: colores.azul }}>Dévora</Text>
              <div className="mt-2">
                <Text variante="medium" style={{ color: colores.azul }}>¡Es un gusto verte de nuevo!</Text>
              </div>
            </div>

            {/* Campos del Formulario */}
            <div className="flex flex-col gap-6 sm:gap-8 items-center w-full">

              {/* Usuario */}
              <div className="flex flex-col gap-3 w-full max-w-sm">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={User03Icon} size={20} className="text-gray-500" />
                  <Text variante="label" style={{ color: colores.gris }}>Usuario</Text>
                </div>
                <Input
                  type="text" 
                  placeholder="Escribe tu usuario o correo..."
                  value={usuario}
                  onChange={handleUsuarioChange}
                  disabled={cargando}
                  maxLength={30}
                  className={`w-full ${autofillClasses}`}
                  regex={/^[a-zA-Z0-9@.\-_]*$/} 
                />
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-3 w-full max-w-sm">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Key01Icon} size={20} className="text-gray-500" />
                  <Text variante="label" style={{ color: colores.gris }}>Contraseña</Text>
                </div>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text2" : "password"}
                    placeholder="Escribe tu contraseña..."
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={cargando}
                    maxLength={30}
                     className={`w-full pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${autofillClasses}`}
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
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mt-6 w-full text-center px-2">
                <Text variante="label" style={{ color: "#E53E3E" }}>{error}</Text>
              </div>
            )}

            {/* Botón para acceder */}
            <div className="w-full flex justify-center mt-8 sm:mt-10">
              <Button variant="entrar" type="submit" disabled={cargando || !!error}>
                {cargando ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
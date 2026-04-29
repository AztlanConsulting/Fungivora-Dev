import React, { useState } from "react";
import Input from "../../shared/components/ui/inputs/input_texto";
import Button from "../../shared/components/ui/buttons/botones";
import Text from "../../shared/components/ui/basics/texto";
import { colores } from "../../shared/components/ui/basics/colores";

import fondoEscritorio from "../../assets/images/fondo_fungivora.png";
import fondoMovil from "../../assets/images/fondo_fungivora_plano.png";

import { HugeiconsIcon } from '@hugeicons/react';
import { ViewOffIcon, ViewIcon, User03Icon, Key01Icon } from '@hugeicons/core-free-icons';

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: usuario,
          contrasena: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login exitoso");
        localStorage.setItem("token", data.token);
        window.location.href = "/first";
      } else {
        setError("Usuario y/o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center">

      {/* Imagenes del fondo*/}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover 
                   bg-[image:var(--bg-movil)] 
                   md:bg-[image:var(--bg-desktop)]"
        style={{
          "--bg-movil": `url(${fondoMovil})`,
          "--bg-desktop": `url(${fondoEscritorio})`,
          backgroundPosition: "center"
        }}
      />

      {/* Contenido del formulario*/}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-lg rounded-[2.5rem] sm:rounded-[3rem] bg-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-y-auto max-h-[90vh] ">
          <form onSubmit={handleLogin} className="flex flex-col items-start w-full">
            {/* Titulos del formulario */}
            <div className="w-full text-center mb-10">
              <Text variante="title" style={{ color: colores.azul }}>Devora</Text>
              <div className="mt-2">
                <Text variante="medium" style={{ color: colores.azul }}>
                  ¡Es un gusto verte de nuevo!
                </Text>
              </div>
            </div>

            {/* Inputs de usuario y contraseña*/}
            <div className="flex flex-col gap-8 w-full">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={User03Icon} size={20} className="text-gray-500 sm:w-6 sm:h-6" />
                  <Text variante="label" style={{ color: colores.gris }}>Usuario</Text>
                </div>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Escribe tu usuario o correo..."
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="w-full pr-12"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Key01Icon} size={20} className="text-gray-500 sm:w-6 sm:h-6" />
                  <Text variante="label" style={{ color: colores.gris }}>Contraseña</Text>
                </div>
                <div className="relative flex items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Escribe tu contraseña..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-12"
                  />
                  <div
                    className="absolute right-4 flex items-center justify-center cursor-pointer select-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <HugeiconsIcon
                      icon={showPassword ? ViewIcon : ViewOffIcon}
                      size={20}
                      className="text-gray-400 hover:text-gray-600 sm:w-6 sm:h-6 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje de error*/}
            {error && (
              <div className="mt-6 w-full text-center animate-fade-in">
                <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>
                  {error}
                </Text>
              </div>
            )}

            {/* Botón de entrar */}
            <div className={`w-full flex justify-center ${error ? 'mt-8' : 'mt-14'}`}>
              <Button variant="entrar" type="submit">Entrar</Button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;
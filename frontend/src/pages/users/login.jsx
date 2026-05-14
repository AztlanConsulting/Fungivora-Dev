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
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // función para dirijirse al backend
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_usuario: usuario,
          contrasena: password,
        }),
      });

      // Mensaje de error y redirección
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/home";
      } else {
        setError("Usuario y/o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError("Usuario y/o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

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
      <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-lg rounded-[3rem] bg-white p-8 sm:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
          <form onSubmit={handleLogin} className="flex flex-col items-start w-full">

            {/* Titulos */}
            <div className="w-full text-center mb-10">
              <Text variante="title" style={{ color: colores.azul }}>Devora</Text>
              <div className="mt-2">
                <Text variante="medium" style={{ color: colores.azul }}>¡Es un gusto verte de nuevo!</Text>
              </div>
            </div>

            <div className="flex flex-col gap-8 w-full items-stretch">

              {/* Usuario */}
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={User03Icon} size={20} className="text-gray-500" />
                  <Text variante="label" style={{ color: colores.gris }}>Usuario</Text>
                </div>
                <div className="relative w-full flex items-center">
                  <Input
                    placeholder="Escribe tu usuario..."
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    disabled={cargando}
                    className="w-full pr-12"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Key01Icon} size={20} className="text-gray-500" />
                  <Text variante="label" style={{ color: colores.gris }}>Contraseña</Text>
                </div>

                <div className="relative w-full flex items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Escribe tu contraseña..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={cargando}
                    className="w-full pr-12 md:pr-20"
                  />
                  <div
                    className="absolute right-4 md:right-12 flex items-center justify-center cursor-pointer select-none"
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

            {/* Mensaje de error */}
            {error && (
              <div className="mt-6 w-full text-center">
                <Text variante="label" style={{ color: "#E53E3E" }}>{error}</Text>
              </div>
            )}

            {/* Botón para acceder */}
            <div className="w-full flex justify-center mt-10">
              <Button variant="entrar" type="submit" disabled={cargando}>
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
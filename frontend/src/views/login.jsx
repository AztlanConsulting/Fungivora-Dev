import React, { useState } from "react";
import Input from "../componentes/input_texto";
import Button from "../componentes/botones";
import Text from "../componentes/texto";
import { colores } from "../componentes/colores";

import fondoEscritorio from "../assets/fondo_fungivora.png";
import fondoMovil from "../assets/fondo_fungivora_plano.png";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login...");
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
        <div className="w-full max-w-lg rounded-[3rem] bg-white p-16 shadow-2xl">
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
                <Text variante="label" style={{ color: colores.gris }}>Usuario</Text>
                <Input
                  placeholder="Escribe tu usuario..."
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Text variante="label" style={{ color: colores.gris }}>Contraseña</Text>
                <Input
                  placeholder="Escribe tu contraseña..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Botón de entrar */}
            <div className="mt-14 w-full flex justify-center">
              <Button variant="entrar" type="submit">Entrar</Button>
            </div>
            
          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

import figuraRoja from "../assets/mariarosaoutline.png";
import figuraVerde from "../assets/melenascontorno.png";

import InputField from "../componentes/entrada_texto_inicio";
import Button from "../componentes/boton_amarillo";
import { HugeiconsIcon } from '@hugeicons/react';
import { Key01Icon, User03Icon } from '@hugeicons/core-free-icons';

const LoginView = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/first");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: usuario,
          contrasena: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "usuario") {
          setErrorMsg("Usuario incorrecto, intente de nuevo");
        } else if (data.error === "password") {
          setErrorMsg("Contraseña incorrecta, intente de nuevo");
        } else {
          setErrorMsg("Error al iniciar sesión");
        }
        return;
      }

      setErrorMsg("");

      localStorage.setItem("token", data.token);
      navigate("/first");

    } catch (error) {
      console.error(error);
      setErrorMsg("Error de conexión");
    }
  };

  return (
    <div className="login-screen min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Título */}
      <div className="header-title text-center mb-8 z-10">
        <h1 className="font-black font-titulo text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Bienvenidxs a
        </h1>
        <h1 className="font-black font-titulo text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          "Fungivora"
        </h1>
      </div>

      {/* Figuras */}
      <img src={figuraVerde} className="figura-verde" />
      <img src={figuraRoja} className="figura-roja" />


      {/* Formulario */}
      <div className="form-box w-full sm:w-96 md:w-[420px] z-10">
        <InputField
          label="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Escribe tu nombre de usuario..."
          icon={<HugeiconsIcon icon={User03Icon} size={28} className="text-white" />}
        />

        <InputField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Escribe tu contraseña..."
          icon={<HugeiconsIcon icon={Key01Icon} size={28} className="text-white" />}
        />
        {errorMsg && (
         <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-2 rounded-xl mt-3 text-center text-[clamp(0.7rem,1.6vw,0.9rem)]">
            {errorMsg}
          </div>
        )}
        <div className="w-full flex justify-center">
          <Button onClick={handleLogin}>
            Entrar
          </Button>
        </div>

      </div>
    </div>
  );
};

export default LoginView;
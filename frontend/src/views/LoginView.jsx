import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

import mariarosaImg from "../assets/mariarosaoutline.png";
import melenasImg from "../assets/melenascontorno.png";

import InputField from "../componentes/entrada_texto_inicio";
import Button from "../componentes/boton_amarillo";

const LoginView = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
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

      if (!data.token) {
        alert(data.msg || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/first");

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="login-screen min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Título */}
      <div className="header-title text-center mb-8 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-titulo">
          Bienvenidxs a
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-titulo">
          "Fungivora"
        </h1>
      </div>

      {/* Figuras */}
      <div className="top-left-group hidden sm:block">
        <div className="green-group-wrapper">
          <div className="shape-part part-1"></div>
          <div className="shape-part part-2"></div>
        </div>
      </div>

      <div className="bottom-right-group hidden sm:block">
        <div className="red-group-wrapper">
          <div className="shape-part part-2"></div>
          <div className="shape-part part-3"></div>
        </div>
      </div>

      {/* Personajes */}
      <img src={melenasImg} className="character-melenas hidden sm:block" />
      <img src={mariarosaImg} className="character-mariarosa hidden sm:block" />

      {/* Formulario */}
      <div className="form-box w-full sm:w-96 md:w-[420px] z-10">

        <InputField
          label="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Escribe tu usuario..."
        />

        <InputField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Escribe tu contraseña..."
        />

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
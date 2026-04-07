import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

import figuraVerde from "../assets/figura_verde.png";
import figuraRoja from "../assets/figura_roja.png";

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
        <h1 className="font-black font-titulo text-[clamp(1.5rem,5vw,3.5rem)]">
          Bienvenidxs a
        </h1>
        <h1 className="font-black font-titulo text-[clamp(1.5rem,5vw,3.5rem)]">
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
import React from 'react';
import '../styles/Login.css';
import mariarosaImg from '../assets/mariarosaoutline.png';
import melenasImg from '../assets/melenascontorno.png';

const LoginView = () => {
  return (
    // Contenedor principal: flex column en móvil, centrado siempre
    <div className="login-screen min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Título: texto más pequeño en móvil, crece en pantallas medianas */}
      <div className="header-title text-center mb-8 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-titulo">
          Bienvenidxs a
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-titulo">
          "Fungivora"
        </h1>
      </div>

      {/* Figuras decorativas — se ocultan en pantallas muy pequeñas */}
      <div className="top-left-group hidden sm:block">
        <div className="green-group-wrapper">
          <div className="shape-part part-1"></div>
          <div className="shape-part part-2"></div>
          <div className="shape-part part-3"></div>
        </div>
      </div>

      <div className="bottom-right-group hidden sm:block">
        <div className="red-group-wrapper">
          <div className="shape-part part-1"></div>
          <div className="shape-part part-2"></div>
          <div className="shape-part part-3"></div>
        </div>
      </div>

      {/* Personajes: se ocultan en móvil, aparecen desde sm */}
      <img
        src={melenasImg}
        alt="Personaje Fungivora Melenas"
        className="character-melenas hidden sm:block"
      />
      <img
        src={mariarosaImg}
        alt="Personaje Fungivora Maria Rosa"
        className="character-mariarosa hidden sm:block"
      />

      {/* Formulario: ancho completo en móvil, fijo en pantallas grandes */}
      <div className="form-box w-full sm:w-96 md:w-[420px] z-10">
        <div className="w-full mb-6 md:mb-8">
          <label className="text-white text-xl md:text-2xl font-bold flex items-center gap-2 ml-2">
            Usuario
          </label>
          <input
            type="text"
            placeholder="Escribe tu entrada..."
            className="input-field"
          />
        </div>

        <div className="w-full mb-6 md:mb-8">
          <label className="text-white text-xl md:text-2xl font-bold flex items-center gap-2 ml-2">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Escribe tu entrada..."
            className="input-field"
          />
        </div>

        <div className="w-full flex justify-center">
          <button className="btn-entrar">Entrar</button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
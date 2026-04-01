import React from 'react';
import '../styles/Login.css';
import mariarosaImg from '../assets/mariarosaoutline.png';

const LoginView = () => {
  return (
    <div className="login-screen">
      
      {/* Título en la parte superior */}
      <div className="header-title">
        <h1 className="text-5xl md:text-6xl font-black text-black">
          Bienvenidxs a
        </h1>
        <h2 className="text-5xl md:text-6xl font-black text-black">
          "Fungivora"
        </h2>
      </div>

      {/* Figuras de fondo */}
      <div className="bg-shape-green"></div>


      <div className="bottom-right-group">
      <div className="red-group-wrapper">
        <div className="shape-part part-1"></div>
        <div className="shape-part part-2"></div>
        <div className="shape-part part-3"></div>
        <img 
          src={mariarosaImg} 
          alt="Personaje Fungivora Maria Rosa" 
          className="character-mariarosa"
        />
      </div>
      </div>

      {/* Formulario centrado */}
      <div className="form-box">
        <div className="w-full mb-8">
          <label className="text-white text-2xl font-bold flex items-center gap-2 ml-2">
            👤 Usuario
          </label>
          <input type="text" placeholder="Escribe tu entrada..." className="input-field" />
        </div>

        <div className="w-full mb-8">
          <label className="text-white text-2xl font-bold flex items-center gap-2 ml-2">
            🔑 Contraseña
          </label>
          <input type="password" placeholder="Escribe tu entrada..." className="input-field" />
        </div>

        <div className="w-full flex justify-center">
          <button className="btn-entrar">Entrar</button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
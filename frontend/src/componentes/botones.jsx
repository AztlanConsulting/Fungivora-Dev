import React from "react";

const colors = {
  confirmar: "#008755",
  editar: "#ffb81c",
  eliminar: "#ed2025"
};

// Definimos escalas de tamaño
const sizes = {
  sm: "px-3 py-1 text-xs",
  md: "px-10 py-4 text-base md:text-3xl w-1/4", 
  lg: "px-10 py-4 text-xl w-full", // Grande y ancho total
};

const Button = ({ children, variant = "editar", size = "lg", onClick, type = "button" }) => {
  return (
    <button
      type={type}
      className={`btn flex items-center justify-center font-bold rounded-xl transition-all ${sizes[size]}`}
      onClick={onClick}
      style={{
        "--btn-color": colors[variant],
        "--btn-shadow": colors[variant]
      }}
    >
      {children}
    </button>
  );
};

export default Button;
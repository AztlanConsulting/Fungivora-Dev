import React from "react";

const colors = {
  confirmar: "#008755",
  editar: "#ffb81c",
  eliminar: "#ed2025"
};

const Button = ({ children, variant = "editar", onClick }) => {
  return (
    <button
      className="btn"
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

{/*
<Button variant="confirmar">Confirmar</Button>
<Button variant="editar">Editar</Button>
<Button variant="eliminar">Eliminar</Button>
*/}
import React from "react";

const colores = {
  blanco: "#fff",
  azul: "#3b3fb6",
  verde: "#148F62",
  gris: "#555555",

  // escala o variantes
  azulClaro: "#777BEB",
  azulMedio: "#4C50C5",
  azulOscuro: "#01068B",
  verdeOscuro: "#25785A",
  verdeClaro: "#78CEAE",
  verdeAccent: "#00B372",
  verdeSoft: "#63A58E",
};

const Color = ({
  variante = "blanco",
  children,
  style = {},
  as: Tag = "div",
}) => {
  const color = colores[variante] || colores.blanco;

  return (
    <Tag style={{ color, ...style }}>
      {children}
    </Tag>
  );
};

export default Color;
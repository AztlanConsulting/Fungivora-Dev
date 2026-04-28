import React from "react";

const variantes = {
  // Titulos: 28px mínimo / 44px máximo
  title: {
    fontSize: "clamp(28px, 5.5vw, 44px)",
    fontWeight: 700,
    color: "#fff",
  },

  // Pop Ups: 14px mínimo / 24px máximo
  popup: {
    fontSize: "clamp(14px, 6vw, 24px)",
    fontWeight: 700,
  },

  // Texto Mediano: 14px mínimo / 24px máximo
  medium: {
    fontSize: "clamp(12px, 4vw, 24px)",
    fontWeight: 500,
  },

  // Texto de select: 14px mínimo / 16px máximo
  label: {
    fontSize: "clamp(14px, 1.8vw, 16px)",
    color: "#3b3fb6",
    fontWeight: 500,
  },

  // Texto de inputs: 12px mínimo / 14px máximo
  input: {
    fontStyle: "italic",
    fontSize: "clamp(12px, 1.5vw, 14px)",
    color: "#868889",
  },

  // Texto de botones: 14px mínimo / 18px máximo
  button: {
    fontSize: "clamp(14px, 3vw, 18px)",
    fontWeight: 600,
    color: "#fff",
  },

  // Texto para dentro del input de fechas: 12px mínimo / 22px máximo
  dates: {
    fontSize: "clamp(12px, 1.5vw, 22px)",
    color: "#999",
  },

  // Texto dentro de los inputs de texto: 12px mínimo / 14px máximo
  placeholder: {
    fontSize: "clamp(12px, 1.8vw, 14px)",
    color: "#999",
    fontStyle: "italic",
  },

  // Texto para las opciones: 16px mínimo / 18px máximo
  option: {
    fontSize: "clamp(16px, 1.8vw, 18px)",
    fontWeight: 600,
    color: "#3b3fb6",
  },

  // Texto para la opción seleccionada: 16px mínimo / 18px máximo
  selected: {
    fontSize: "clamp(16px, 1.8vw, 18px)",
    color: "#fff",
    fontWeight: 500,
  },

  // Texto base: 14px mínimo / 16px máximo
  body: {
    fontSize: "clamp(14px, 1.2vw, 16px)",
  },
};

/**
* Text
Componente tipográfico reutilizable que aplica estilos según variantes
definidas para mantener consistencia visual.
Soporta diferentes tipos de texto como títulos, labels, botones, inputs, etc.

@param variante Tipo de estilo de texto
@param children Contenido textual
@param style Estilos adicionales personalizados
@param as Tipo de etiqueta HTML a renderizar 
*/
const Text = ({
  variante = "body",
  children,
  style = {},
  as: Tag = "p",
}) => {
  const variantStyles = variantes[variante] || variantes.body;

  return (
    <Tag
      style={{
        margin: 0,
        lineHeight: 1.4,
        ...variantStyles,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
};

export default Text;
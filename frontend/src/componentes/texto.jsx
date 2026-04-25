import React from "react";

//Las diferentes variantes establecidad en ambos desktop y movil
const variantes = {
  // Titulos: 40 mobile / 64 desktop 
  title: {
    fontSize: "clamp(40px, 5.5vw, 64px)",
    fontWeight: 700,
    color: "#fff",
  },

  // Pop Ups: 32 mobile / 64 desktop 
  popup: {
    fontSize: "clamp(32px, 6vw, 64px)",
    fontWeight: 700,
  },

  // Texto Mediano: 32 mobile / 48 desktop
  medium: {
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: 500,
  },

  // Texto de select: 16 mobile / 24 desktop
  label: {
    fontSize: "clamp(16px, 1.8vw, 24px)",
    color: "#3b3fb6",
    fontWeight: 500,
  },

  // Texto de inputs: 14 mobile / 20 desktop
  input: {
    fontSize: "clamp(14px, 1.5vw, 20px)",
    color: "#666",
  },

  // Texto de botones: 18 mobile / 36 desktop
  button: {
    fontSize: "clamp(18px, 3vw, 32px)",
    fontWeight: 600,
    color: "#fff",
  },

  // Texto para dentro del input de fechas: 20 mobile / 40 desktop
  dates: {
    fontSize: "clamp(20px, 2.5vw, 40px)",
    color: "#999",
  },

  // Texto dentro de los inputs de texto: 16 mobile / 24 desktop
  placeholder: {
    fontSize: "clamp(16px, 1.2vw, 24px)",
    color: "#999",
    fontStyle: "italic",
  },

  // Texto para las opciones: 24 mobile / 32 desktop
  option: {
    fontSize: "clamp(24px, 2vw, 32px)",
    color: "#3b3fb6",
  },

  // Texto para la opción seleccionada: 24 mobile / 32 desktop
  selected: {
    fontSize: "clamp(24px, 2vw, 32px)",
    color: "#fff",
    fontWeight: 500,
  },

  body: {
    fontSize: "clamp(14px, 1.2vw, 16px)",
  },
};

/*
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
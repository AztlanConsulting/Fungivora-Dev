import React from "react";
import { colores } from "./colores";
import Text from "./texto";

// Colores relacionados al tipo de boton
const variants = {
  entrar: "azulClaro",
  cancelar: "azulMedio",
  eliminar: "azulOscuro",
  registrar: "verdeOscuro",
  siguiente: "verdeClaro",
  agregar: "verdeAccent",
  confirmar: "verdeSoft",
};

// Tamaño cambiante por el tamaño de pantalla
const sizes = {
  lg: "w-40 h-9 md:w-60 md:h-14 text-base md:text-lg",
};

// Redondeo de las esquinas
const roundings = {
  full: "rounded-full",
};

/*
* Button
Componente reutilizable para renderizar botones
con variante, tamaño y redondeo definidos.
Permite asignar colores  y tipografía uniforme.

@param children Contenido del botón 
@param variant Tipo de botón
@param size Tamaño del botón
@param rounded Tipo de redondeo de esquinas
@param onClick Función que se ejecuta al hacer clic
@param type Tipo de botón HTML
*/
const Button = ({
  children,
  variant = "editar",
  size = "lg", 
  rounded = "full", 
  onClick,
  type = "button",
}) => {
  const colorKey = variants[variant] || "azul";
  const bgColor = colores[colorKey] || colores.azul;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        flex items-center justify-center 
        transition-all hover:opacity-90 active:scale-95
        flex-shrink-0 
        ${sizes[size]}
        ${roundings[rounded]}
      `}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="truncate px-1">
        <Text variante="button">
          {children}
        </Text>
      </div>
    </button>
  );
};

export default Button;
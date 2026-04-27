import React from "react";
import { colores } from "./colores";
import Text from "./texto";

// Colores relacionados al tipo de boton
const variants = {
  entrar: "azulClaro",
  cancelar: "azulOscuro",
  eliminar: "azulOscuro",
  registrar: "verdeAccent",
  siguiente: "verdeAccent",
  agregar: "verdeAccent",
  confirmar: "verdeAccent",
};

// Tamaño cambiante por el tamaño de pantalla
const sizes = {
  lg: "w-40 h-8 md:w-52 md:h-10 text-base md:text-lg",
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
  variant = "entrar",
  size = "lg", 
  rounded = "full", 
  onClick,
  type = "button",
  isOutline = false,
  icon: Icon,
}) => {
  const colorKey = variants[variant] || "azul";
  const mainColor = colores[colorKey] || colores.azul;
  const textColor = isOutline ? mainColor : "#FFFFFF";
  const buttonStyle = isOutline 
    ? {
        backgroundColor: "#FFFFFF",
        border: `2px solid ${mainColor}`,
      }
    : {
        backgroundColor: mainColor,
        border: `2px solid transparent`,
      };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2
        transition-all hover:opacity-90 active:scale-95
        flex-shrink-0 
        ${sizes[size]}
        ${roundings[rounded]}
      `}
      style={buttonStyle}
    >
      <div className="flex items-center justify-center gap-2 truncate px-1">
        <Text 
          variante="button" 
          style={{ color: textColor }}
        >
          {children}
        </Text>
        
        {/** Renderizado condicional del icono con el mismo color del texto */}
        {Icon && (
          <Icon 
            size={20} 
            color={textColor} 
            variant="outline" // Ajusta según la versión de Huge Icons que uses
          />
        )}
      </div>
    </button>
  );
};

export default Button;
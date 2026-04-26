import React, { useState } from "react";
import { colores } from "./colores";
import Text from "./texto";

// Barra de Busqueda

const BarraBusqueda = ({
  value,
  onChange,
  placeholder = "Buscar...",
  icon,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const ringColor = isFocused ? colores.verde : colores.azul;

  return (
    <div
      className={`relative flex items-center w-80 md:w-96 h-7 md:h-10 rounded-full overflow-hidden transition-all bg-[#F9FDFF] ${className}`}
      style={{ boxShadow: `0 0 0 ${isFocused ? "4px" : "2px"} ${ringColor}` }}
    >
      {/* Placeholder visual con tipografía del sistema */}
      {!value && (
        <div className="absolute inset-0 flex items-center px-5 pointer-events-none">
          <Text variante="input">{placeholder}</Text>
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-full px-5 bg-transparent outline-none pr-10"
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "clamp(16px, 1.5vw, 20px)",
          color: "#000",
        }}
      />

      {/* Icono */}
      {icon && (
        <div
          className="absolute right-4 flex items-center pointer-events-none"
          style={{ color: ringColor, transition: "color 0.2s" }}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default BarraBusqueda;
import React, { useState } from "react";
import { colores } from "./colores";
import Text from "./texto";

/**
 * BarraBusqueda
 * Input de búsqueda con borde azul en reposo y verde al enfocar.
 * 
 * Uso:
 * <BarraBusqueda
 *   value={busqueda}
 *   onChange={(e) => setBusqueda(e.target.value)}
 *   placeholder="Buscar producto..."
 *   icon={<HugeiconsIcon icon={Search02Icon} size={20} />}
 * />
 */
const BarraBusqueda = ({
  value,
  onChange,
  placeholder = "Buscar...",
  icon,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Azul en reposo, verde al enfocar — consistente con el sistema de diseño
  const ringColor = isFocused ? colores.verde : colores.azul;

  return (
    // El boxShadow simula el ring de foco para poder cambiar su color dinámicamente
    <div
      className={`relative flex items-center w-80 md:w-96 h-7 md:h-10 rounded-md overflow-hidden transition-all bg-[#F9FDFF] ${className}`}
      style={{ boxShadow: `0 0 0 ${isFocused ? "4px" : "2px"} ${ringColor}` }}
    >
      {/* Placeholder visible solo cuando el input está vacío.
          pointer-events-none evita que bloquee los clics hacia el input real */}
      {!value && (
        <div className="absolute inset-0 flex items-center px-5 pointer-events-none">
          <Text variante="input">{placeholder}</Text>
        </div>
      )}

      {/* Input real — outline-none quita el foco nativo del navegador
          ya que el foco visual lo maneja el contenedor padre con boxShadow
          pr-10 reserva espacio a la derecha para que el texto no quede debajo del icono */}
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

      {/* Icono decorativo — cambia de color junto con el borde al enfocar
          pointer-events-none evita que intercepte clics del usuario */}
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
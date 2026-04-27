import React, { useState } from "react";
import { colores } from "./colores";
import Input from "./input_texto";
import { HugeiconsIcon } from '@hugeicons/react';
import { Search02Icon } from '@hugeicons/core-free-icons';

/**
 * BarraBusqueda
 * Input de búsqueda que reutiliza el componente Input del sistema.
 * El icono de búsqueda está incluido dentro del componente y cambia
 * de color junto con el borde al enfocar.
 *
 * Uso:
 * <BarraBusqueda
 *   value={busqueda}
 *   onChange={(e) => setBusqueda(e.target.value)}
 *   placeholder="Buscar producto..."
 * />
 */
const BarraBusqueda = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Azul en reposo, verde al enfocar — consistente con el sistema de diseño
  const ringColor = isFocused ? colores.verde : colores.azul;

  return (
    // Contenedor relativo para posicionar el icono sobre el Input
    <div
      className={`relative ${className}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <Input
        variante="normal"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {/* Icono de búsqueda posicionado sobre el lado derecho del Input.
          Cambia de color junto con el borde al enfocar.
          pointer-events-none evita que intercepte clics del usuario */}
      <div
        className="absolute right-4 inset-y-0 flex items-center pointer-events-none"
        style={{ color: ringColor, transition: "color 0.2s" }}
      >
        <HugeiconsIcon icon={Search02Icon} size={20} />
      </div>
    </div>
  );
};

export default BarraBusqueda;
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
 * value={busqueda}
 * onChange={(e) => setBusqueda(e.target.value)}
 * placeholder="Buscar producto..."
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
  const ringColor = isFocused ? colores.azul : colores.grisMedio;

  return (
    /**
     * Contenedor relativo: 
     * Se usa 'w-fit' para que el contenedor mida exactamente lo mismo que el Input interno.
     * Esto evita que el icono se desplace fuera de la caja si el contenedor padre es más ancho.
     */
    <div
      className={`relative w-fit max-w-full ${className}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <Input
        variante="normal"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-12"
      />

      {/* Icono de búsqueda posicionado al final de la caja.
          Al estar dentro de un contenedor 'w-fit', el 'left-4' siempre será
          respecto al final real del Input.
          pointer-events-none evita que intercepte clics del usuario */}
      <div
        className="absolute left-4 inset-y-0 flex items-center pointer-events-none"
        style={{ 
            color: ringColor, 
            transition: "color 0.2s",
            zIndex: 10
        }}
      >
        <HugeiconsIcon icon={Search02Icon} size={20} />
      </div>
    </div>
  );
};

export default BarraBusqueda;
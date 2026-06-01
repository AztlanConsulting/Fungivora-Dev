import React, { useState } from "react";
import { colores } from "../basics/Colores";
import Input from "../inputs/InputTexto";
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
  const ringColor = isFocused ? colores.azul : colores.grisMedio;

  return (

    <div
      className={`relative w-full max-w-md ${className}`} 
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
    <Input
      variante="search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="pl-12 pr-4 py-2.5 w-full" 
      placeholderLeft="left-12" 
    />

    <div
      className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none"
      style={{ color: ringColor, transition: "color 0.2s", zIndex: 20 }}
    >
      <HugeiconsIcon icon={Search02Icon} size={20} />
    </div>
    </div>
  );
};

export default BarraBusqueda;
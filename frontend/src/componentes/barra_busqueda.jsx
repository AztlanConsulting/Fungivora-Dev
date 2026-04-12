import React from "react";

const BarraBusqueda = ({
  value,
  onChange,
  placeholder = "Buscar...",
  icon,
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center">

        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pr-10 pl-4 py-2 rounded-xl border-2 border-[#3B3FB6] bg-[#F9FDFF]
                     text-sm outline-none
                     focus:border-[#3B3FB6] focus:ring-2 focus:ring-[#3B3FB6]/30
                     transition-all duration-200"  /* Ya incluye los colores establecidos*/
        />

        {icon && (
          <span className="absolute right-3 text-gray-400"> {/* No importa el color del icono, eso se cambia en la vista */}
            {icon}
          </span>
        )}

      </div>
    </div>
  );
};

export default BarraBusqueda;

      /* Hacer copy paste para utilizarlo en la vista:
    import { HugeiconsIcon } from '@hugeicons/react';
    import { Search02Icon } from '@hugeicons/core-free-icons';
    import BarraBusqueda from "../componentes/barra_busqueda";

      <BarraBusqueda
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar producto..."
        icon={<HugeiconsIcon icon={Search02Icon} size={24} className="text-[#3B3FB6]" />}
      />*/
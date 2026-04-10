import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Inventario.css";

import { HugeiconsIcon } from '@hugeicons/react';
import { Search02Icon } from '@hugeicons/core-free-icons';
import BarraBusqueda from "../componentes/barra_busqueda";

const Inventario = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className="inventary-screen">
        
        <div className="contenido">
        
        {/* Título */}
        <h1 className="titulo">
            Inventario
        </h1>

        {/* Barra de búsqueda */}
        <div className="barra-container">
            <BarraBusqueda
            className="max-w-[800px]"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            icon={<HugeiconsIcon icon={Search02Icon} size={24} className="text-[#3B3FB6]" />}
            />
        </div>

        </div>

    </div>
    );
};

export default Inventario;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Inventario.css";

import { HugeiconsIcon } from '@hugeicons/react';
import { Search02Icon , FilterMailIcon , PlusSignIcon} from '@hugeicons/core-free-icons';
import BarraBusqueda from "../componentes/barra_busqueda";

const Inventario = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/inventario")
        .then(res => res.json())
        .then(data => {
        console.log("Datos del backend:", data);
        setDatos(data);
        })
        .catch(err => console.error(err));
    }, []);

  return (
    <div className="inventary-screen">
        
        <div className="contenido">
        
        {/* Título */}
        <h1 className="titulo">
            Inventario
        </h1>

        {/* Área de busqueda, filtro y añadir */}
        <div className="barra-container">

            <div className="flex-1">
                <BarraBusqueda
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto..."
                icon={<HugeiconsIcon icon={Search02Icon} size={24} className="text-[#3B3FB6]" />}
                />
            </div>

            <HugeiconsIcon 
                icon={FilterMailIcon} 
                size={45} 
                className="text-[#FE5000] icono"
            />

            <div className="btn-add">
                <HugeiconsIcon icon={PlusSignIcon} size={30} className="text-white" />
            </div>

            </div>
        </div>

    </div>
    );
};

export default Inventario;
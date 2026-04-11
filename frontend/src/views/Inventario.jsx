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
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

    useEffect(() => {
    const obtenerDatos = () => {
        fetch("http://localhost:5000/inventario")
        .then(res => res.json())
        .then(data => setDatos(data))
        .catch(err => console.error(err));
    };

    obtenerDatos();

    //! Para que se actualicen los datos sin tener que refrescar la pagina
    const intervalo = setInterval(obtenerDatos, 5000);
    return () => clearInterval(intervalo);
    }, []);

  return (
<div className="inventary-screen">
  <div className="contenido">
    
    {/* Título */}
    <h1 className="titulo">Inventario</h1>

    {/* Barra de busqueda (no funcional) */}
    <div className="barra-container">
      <div className="flex-1">
        <BarraBusqueda
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar producto..."
          icon={<HugeiconsIcon icon={Search02Icon} size={24} className="text-[#3B3FB6]" />}
        />
      </div>

    {/* Icono de filtro (no funcional) */}
      <HugeiconsIcon 
        icon={FilterMailIcon} 
        size={45} 
        className="text-[#FE5000] icono"
      />

    {/* Circulo de agregar (no funcional) */}
      <div className="btn-add">
        <HugeiconsIcon icon={PlusSignIcon} size={30} className="text-white" />
      </div>
    </div>

    {/* Tabla de informacion del inventario */}
    <div className="tabla-container">
      <table className="tabla-inventario">
        {/* Encabezado de la tabla */}
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Recomendado</th>
            <th>Fecha</th>
          </tr>
        </thead>

        {/* Cuerpo de la tabla */}
        <tbody>
        {datos.map((item, index) => (
            <tr 
            key={item.id_inventario}
            onClick={() => setFilaSeleccionada(item.id_inventario)}
            className={filaSeleccionada === item.id_inventario ? "seleccionada" : ""} //! Cambia el color al seleccionar la fila
            >
            <td>{item.nombre_inventario}</td>
            <td>{item.nombre_categoria}</td>
            <td>{item.cantidad_inventario} {item.unidad_medida}</td> {/* Une la cantidad y la unidad de medida (2 kg) */}
            <td>{item.stock_recomendado} {item.unidad_medida}</td> {/* Une el stock recomendado y la unidad de medida (2 kg) */}
            <td>{new Date(item.fecha_inventario).toLocaleDateString()}</td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>

  </div>
</div>
    );
};

export default Inventario;
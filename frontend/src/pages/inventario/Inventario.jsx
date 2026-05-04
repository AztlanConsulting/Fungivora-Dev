import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/titulo";
import Text from "../../shared/components/ui/basics/texto";
import { colores } from "../../shared/components/ui/basics/colores";
import useInsumos from "../../features/inventario/hooks/useInsumos";

import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon } from "@hugeicons/core-free-icons";

// Color del header
const colorBordeHeader = "#F2F2FC";

// Nombres de las columnas
const columnasHeader = [
    { label: "Insumo",            key: "nombre" },
    { label: "Cantidad Actual",   key: "cantidad" },
    { label: "Stock Recomendado", key: "stock_recomendado" },
];

const Inventario = () => {
    // Const del hook
    const { insumos, unidades, loading, error, addInsumo, updateInsumo } = useInsumos();
    
    const [busqueda, setBusqueda] = useState("");
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [editando, setEditando] = useState(null);
    const [valorEditado, setValorEditado] = useState("");
    const [nuevaFila, setNuevaFila] = useState({ nombre: "", cantidad: "", stock_recomendado: "", unidad: "" });
    const [errorValidacion, setErrorValidacion] = useState("");

    // Para tener una nueva fila
    const handleNuevaFila = (campo, valor) => {
        setNuevaFila((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };


    const guardarCambioCantidad = async (id) => {
        const exito = await updateInsumo(id, { cantidad: valorEditado });
        if (exito) setEditando(null);
    };

    // Que cuando haga enter se guarden los datos
    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            const { nombre, cantidad, stock_recomendado, unidad } = nuevaFila;
            
            if (
                nombre.trim() !== "" && 
                cantidad !== "" && 
                stock_recomendado !== "" && 
                unidad !== ""
            ) {
                setErrorValidacion(""); 
                const exito = await addInsumo(nuevaFila);
                if (exito) {
                    setNuevaFila({ nombre: "", cantidad: "", stock_recomendado: "", unidad: "" });
                }
            } else {
                setErrorValidacion("Por favor, completa todos los campos");
            }
        }
    };

    // Para filtar datos (futura busqueda)
    const insumosFiltrados = insumos.filter((item) =>
        item && item.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const gridLayout = "grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1.5fr_250px]";

    return (
        <>
            <Titulo>Inventario</Titulo>
            <Base margen_arriba="mt-24 md:mt-20">
            {/* Mensaje de Error */}
                {errorValidacion && (
                    <div className="mb-4 w-full text-center">
                        <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>
                            {errorValidacion}
                        </Text>
                    </div>
                )}
                    <div className="w-full bg-white rounded-[32px] shadow-sm border p-4 md:p-8 min-h-[500px]">

                        {/* Mensaje de cargando*/}
                        {loading && (
                            <div className="flex justify-center items-center h-[400px]">
                                <Text variante="medium">Cargando insumos...</Text>
                            </div>
                        )}

                        {!loading && !error && (
                            <div
                                className="flex flex-col md:border md:rounded-2xl overflow-hidden"
                                style={{ borderColor: colorBordeHeader }}
                            >
                                {/* Encabezado Desktop */}
                                <div
                                    className={`hidden md:grid ${gridLayout}`}
                                    style={{ backgroundColor: colorBordeHeader }}
                                >
                                    {columnasHeader.map((col, i) => (
                                        <div key={i} className="px-6 py-4">
                                            <Text variante="medium" style={{ color: colores.azul, fontWeight: "600" }}>
                                                {col.label}
                                            </Text>
                                        </div>
                                    ))}
                                    <div className="px-6 py-4" />
                                </div>

                                {/* Fila de Inputs */}
                                <div 
                                    className={`grid ${gridLayout} border-b`}
                                    style={{ borderColor: colorBordeHeader }}
                                >
                                 {/* Inputs movil*/}
                                    <div className="md:hidden flex flex-col gap-3 p-4">
                                        <input 
                                            type="text" 
                                            placeholder="Nombre del insumo..." 
                                            className="w-full p-3 rounded-xl  border outline-none text-sm"
                                            value={nuevaFila.nombre}
                                            onChange={(e) => handleNuevaFila("nombre", e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <div className="flex gap-2">
                                            <input 
                                                type="number" 
                                                placeholder="Cant." 
                                                className="w-1/3 p-3 rounded-xl border outline-none text-sm"
                                                value={nuevaFila.cantidad}
                                                onChange={(e) => handleNuevaFila("cantidad", e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Rec." 
                                                className="w-1/3 p-3 rounded-xl border outline-none text-sm"
                                                value={nuevaFila.stock_recomendado}
                                                onChange={(e) => handleNuevaFila("stock_recomendado", e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <select 
                                                className="w-1/3 p-3 rounded-xl border outline-none text-sm bg-white"
                                                value={nuevaFila.unidad}
                                                onChange={(e) => handleNuevaFila("unidad", e.target.value)}
                                                style={{ color: "#9CA3AF" }}
                                            >
                                                <option value="" disabled>Unidad</option>
                                                {unidades.map((uni, index) => (
                                                    <option key={index} value={uni.opcion}>
                                                        {uni.opcion}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Inputs desktop*/}
                                    <div className="hidden md:flex px-6 py-4 items-center">
                                        <input type="text" placeholder="Nombre del insumo..." className="outline-none w-full italic text-sm bg-transparent"
                                            value={nuevaFila.nombre}
                                            onChange={(e) => handleNuevaFila("nombre", e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>

                                    <div className="hidden md:flex px-6 py-4 items-center">
                                        <input type="number" placeholder="Cantidad..." className="outline-none w-full italic text-sm bg-transparent"
                                            value={nuevaFila.cantidad}
                                            onChange={(e) => handleNuevaFila("cantidad", e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>

                                    <div className="hidden md:flex px-6 py-4 items-center">
                                        <input type="number" placeholder="Recomendado..." className="outline-none w-full italic text-sm bg-transparent"
                                            value={nuevaFila.stock_recomendado}
                                            onChange={(e) => handleNuevaFila("stock_recomendado", e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>

                                    <div className="hidden md:flex py-4 items-center px-6">
                                        <select 
                                            className="outline-none w-full italic text-sm bg-transparent cursor-pointer"
                                            value={nuevaFila.unidad}
                                            onChange={(e) => handleNuevaFila("unidad", e.target.value)}
                                            style={{ color: "#9CA3AF" }}
                                            onKeyDown={handleKeyDown}
                                        >
                                            <option value="" disabled>Unidad...</option>
                                            {unidades.map((uni, index) => (
                                                <option key={index} value={uni.opcion} className="not-italic">
                                                    {uni.opcion}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Filas de Datos*/}
                                <div className=" max-h-[550px]  md:max-h-[480px] overflow-y-auto bg-transparent md:bg-white flex flex-col gap-3 md:gap-0">
                                    {insumosFiltrados.map((item) => {
                                        const esSeleccionado = filaSeleccionada === item.id_insumo;
                                        const estaEditandoCantidad = editando === item.id_insumo;

                                        return (
                                            <div key={item.id_insumo} onClick={() => setFilaSeleccionada(item.id_insumo)}>

                                                {/* Desktop*/}
                                                <div
                                                    className={`hidden md:grid ${gridLayout} cursor-pointer transition-all relative ${esSeleccionado ? "z-10" : "border-b"}`}
                                                    style={{
                                                        borderColor: colorBordeHeader,
                                                        boxShadow: esSeleccionado ? `inset 0 0 0 2px ${colores.azul}` : "none",
                                                        backgroundColor: "white",
                                                    }}
                                                >
                                                    <div className="px-6 py-5 flex items-center">
                                                        <Text variante="option" style={{ color: "black", fontWeight: "600" }}>{item.nombre}</Text>
                                                    </div>
                                                    <div 
                                                        className="px-8 py-5 flex items-center"
                                                        onDoubleClick={() => {
                                                            setEditando(item.id_insumo);
                                                            setValorEditado(item.cantidad);
                                                        }}
                                                    >
                                                        {estaEditandoCantidad ? (
                                                            <input
                                                                autoFocus
                                                                type="number"
                                                                className="w-full border-b border-blue-500 outline-none"
                                                                value={valorEditado}
                                                                onChange={(e) => setValorEditado(e.target.value)}
                                                                onBlur={() => guardarCambioCantidad(item.id_insumo)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") guardarCambioCantidad(item.id_insumo);
                                                                    if (e.key === "Escape") setEditando(null);
                                                                }}
                                                            />
                                                        ) : (
                                                            <Text variante="option" style={{ color: colores.black, fontWeight: 400}}>
                                                                {parseFloat(item.cantidad)} {item.unit || item.unidad}
                                                            </Text>
                                                        )}
                                                    </div>
                                                    <div className="px-9 py-5 flex items-center">
                                                        <Text variante="option" style={{ color: colores.black, fontWeight: 400}}>{parseFloat(item.stock_recomendado)} {item.unidad}</Text>
                                                    </div>
                                                    <div className="px-28 py-5 flex items-center justify-end">
                                                        <HugeiconsIcon icon={CancelCircleIcon} size={22} color={colores.azul} className="cursor-pointer hover:opacity-80 transition-opacity" />
                                                    </div>
                                                </div>

                                                {/* Móvil */}
                                                <div className={`md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-4 ${esSeleccionado ? "ring-2" : ""}`} style={{ borderColor: esSeleccionado ? colores.azul : colorBordeHeader }}>
                                                    <div className="flex justify-between items-start">
                                                        <Text variante="option" style={{ color: colores.black, fontWeight: "500", fontSize: "18px" }}>{item.nombre}</Text>
                                                        <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                                                        <Text variante="option" style={{ color: colores.gris, fontSize: "14px", fontWeight: 400 }}>{parseFloat(item.cantidad)} {item.unidad}</Text>
                                                        <Text variante="option" style={{ color: colores.gris, fontSize: "14px", fontWeight: 400 }}>{parseFloat(item.stock_recomendado)} {item.unidad}</Text>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
            </Base>
        </>
    );
};

export default Inventario;
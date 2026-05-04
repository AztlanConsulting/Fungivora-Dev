// frontend/src/pages/inventario/Inventario.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/titulo";
import BarraBusqueda from "../../shared/components/ui/others/barra_busqueda";
import Text from "../../shared/components/ui/basics/texto";
import Button from "../../shared/components/ui/buttons/botones";
import { colores } from "../../shared/components/ui/basics/colores";
import useInsumos from "../../features/inventario/hooks/useInsumos";

import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon } from "@hugeicons/core-free-icons";

const colorBordeHeader = "#F2F2FC";

const columnas = [
    { label: "Insumo",            key: "nombre" },
    { label: "Cantidad Actual",   key: "cantidad" },
    { label: "Stock Recomendado", key: "stock_recomendado" },
];

const Inventario = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const { insumos, loading, error } = useInsumos();

    // Bloquea el scroll horizontal en toda la página mientras esta vista está montada
    useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => { document.body.style.overflowX = ""; };
    }, []);

    const insumosFiltrados = insumos.filter((item) =>
        item.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <>
            <Titulo>Inventario</Titulo>

            <Base margen_arriba="mt-24 md:mt-20">
                <div className="flex flex-col gap-4">

                    {/* Móvil: barra arriba, botón abajo — Desktop: en fila */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="w-full md:flex-1">
                            <BarraBusqueda
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar insumo..."
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <Button
                                variant="agregar"
                                onClick={() => navigate("/inventario/crearInsumo")}
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>

                    {/* Tarjeta contenedora */}
                    <div className="w-full bg-white rounded-[32px] shadow-sm border p-4 md:p-8 min-h-[500px]">

                        {/* Estado de carga */}
                        {loading && (
                            <div className="flex justify-center items-center h-[400px]">
                                <Text variante="medium">Cargando insumos...</Text>
                            </div>
                        )}

                        {/* Estado de error */}
                        {error && (
                            <div className="flex justify-center items-center h-[400px]">
                                <Text variante="medium" style={{ color: "red" }}>{error}</Text>
                            </div>
                        )}

                        {/* Tabla */}
                        {!loading && !error && (
                            <div
                                className="flex flex-col md:border md:rounded-2xl overflow-hidden"
                                style={{ borderColor: colorBordeHeader }}
                            >
                                {/* Encabezado desktop */}
                                <div
                                    className="hidden md:grid md:grid-cols-4"
                                    style={{ backgroundColor: colorBordeHeader }}
                                >
                                    {columnas.map((col, i) => (
                                        <div key={i} className="px-6 py-4">
                                            <Text variante="medium" style={{ color: colores.azul, fontWeight: "600" }}>
                                                {col.label}
                                            </Text>
                                        </div>
                                    ))}
                                    <div className="px-6 py-4" />
                                </div>

                                {/* Sin resultados */}
                                {insumosFiltrados.length === 0 && (
                                    <div className="flex justify-center items-center h-[200px]">
                                        <Text variante="body" style={{ color: colores.gris }}>
                                            No se encontraron insumos.
                                        </Text>
                                    </div>
                                )}

                                {/* Contenedor de filas */}
                                <div className="max-h-[680px] md:max-h-[530px] overflow-y-auto bg-transparent md:bg-white flex flex-col gap-3 md:gap-0">
                                    {insumosFiltrados.map((item) => {
                                        const esSeleccionado = filaSeleccionada === item.id_insumo;

                                        return (
                                            <div key={item.id_insumo} onClick={() => setFilaSeleccionada(item.id_insumo)}>

                                                {/* Vista Móvil */}
                                                <div
                                                    className={`md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-4 transition-all ${esSeleccionado ? "ring-2" : ""}`}
                                                    style={{
                                                        borderColor: esSeleccionado ? colores.azul : colorBordeHeader,
                                                        boxShadow: esSeleccionado
                                                            ? "0 4px 15px rgba(0,0,0,0.08)"
                                                            : "0 2px 4px rgba(0,0,0,0.04)",
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <Text variante="option" style={{ color: colores.black, fontWeight: "500", fontSize: "18px" }}>
                                                            {item.nombre}
                                                        </Text>
                                                        <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} className="cursor-pointer" />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                                                        <div className="flex flex-col gap-1">
                                                            
                                                            <Text variante="option" style={{ color: colores.gris, fontSize: "14px", fontWeight: "400" }}>
                                                                {parseFloat(item.cantidad)} {item.unidad}
                                                            </Text>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            
                                                            <Text variante="option" style={{ color: colores.gris, fontSize: "14px", fontWeight: "400" }}>
                                                                {parseFloat(item.stock_recomendado)} {item.unidad}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Vista Desktop */}
                                                <div
                                                    className={`hidden md:grid md:grid-cols-4 cursor-pointer transition-all relative ${esSeleccionado ? "z-10" : "border-b"}`}
                                                    style={{
                                                        borderColor: colorBordeHeader,
                                                        boxShadow: esSeleccionado ? `inset 0 0 0 2px ${colores.azul}` : "none",
                                                        backgroundColor: "white",
                                                    }}
                                                >
                                                    {columnas.map((col, i) => (
                                                        <div key={i} className="px-6 py-5 flex items-center">
                                                            <Text
                                                                variante="option"
                                                                style={{
                                                                    color: "black",
                                                                    fontWeight: col.key === "nombre" ? "600" : "400",
                                                                }}
                                                            >
                                                                {col.key === "cantidad" || col.key === "stock_recomendado"
                                                                    ? `${parseFloat(item[col.key])} ${item.unidad}`
                                                                    : item[col.key]}
                                                            </Text>
                                                        </div>
                                                    ))}
                                                    <div className="px-6 py-5">
                                                        <HugeiconsIcon
                                                            icon={CancelCircleIcon}
                                                            size={24}
                                                            color={colores.azul}
                                                            className="cursor-pointer hover:opacity-80 transition-opacity"
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Base>
        </>
    );
};

export default Inventario;
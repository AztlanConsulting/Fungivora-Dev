// frontend/src/pages/inventario/Inventario.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/titulo";
import BarraBusqueda from "../../shared/components/ui/others/barra_busqueda";
import Text from "../../shared/components/ui/basics/texto";
import { colores } from "../../shared/components/ui/basics/colores";
import useInsumos from "../../features/inventario/hooks/useInsumos";

import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

const colorHeader = "#F2F2FC";
const encabezados = ["Insumo", "Categoría", "Cantidad Actual", "Stock Recomendado"];

const Inventario = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");
    const { insumos, loading, error } = useInsumos();

    const insumosFiltrados = insumos.filter((item) =>
        item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.nombre_categoria?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <>
            <Titulo>Inventario</Titulo>

            <Base margen_arriba="mt-24 md:mt-20">
                <div className="flex flex-col gap-4">

                    {/* Barra de búsqueda y botón agregar */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <BarraBusqueda
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar insumo..."
                            />
                        </div>
                        <div
                            className="flex items-center justify-center w-11 h-11 rounded-full cursor-pointer"
                            style={{ backgroundColor: colores.azul }}
                            onClick={() => navigate("/inventario/crearInsumo")}
                        >
                            <HugeiconsIcon icon={PlusSignIcon} size={24} color={colores.blanco} />
                        </div>
                    </div>

                    {/* Estado de carga */}
                    {loading && (
                        <div className="px-4 py-10 text-center bg-white rounded-xl">
                            <Text variante="body" style={{ color: colores.gris }}>
                                Cargando insumos...
                            </Text>
                        </div>
                    )}

                    {/* Estado de error */}
                    {error && (
                        <div className="px-4 py-10 text-center bg-white rounded-xl">
                            <Text variante="body" style={{ color: colores.gris }}>
                                {error}
                            </Text>
                        </div>
                    )}

                    {/* Tarjeta contenedora de la tabla */}
                    {!loading && !error && (
                        <div
                            className="w-full rounded-2xl overflow-hidden"
                            style={{
                                backgroundColor: "#FFFFFF",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                border: `1px solid ${colorHeader}`,
                            }}
                        >
                            {/* Encabezado */}
                            <div
                                className="hidden md:grid md:grid-cols-4"
                                style={{ backgroundColor: colorHeader }}
                            >
                                {encabezados.map((enc, i) => (
                                    <div key={i} className="px-4 py-3">
                                        <Text variante="option">{enc}</Text>
                                    </div>
                                ))}
                            </div>

                            {/* Sin resultados */}
                            {insumosFiltrados.length === 0 && (
                                <div className="px-4 py-10 text-center">
                                    <Text variante="body" style={{ color: colores.gris }}>
                                        No se encontraron insumos.
                                    </Text>
                                </div>
                            )}

                            {/* Filas */}
                            {insumosFiltrados.map((item, index) => (
                                <div
                                    key={item.id_insumo}
                                    className="grid grid-cols-1 md:grid-cols-4"
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        borderBottom: index === insumosFiltrados.length - 1
                                            ? "none"
                                            : `1px solid ${colorHeader}`,
                                    }}
                                >
                                    {/* Vista móvil */}
                                    <div
                                        className="md:hidden px-4 py-3 border-2 mb-2 rounded-lg"
                                        style={{ borderColor: colorHeader }}
                                    >
                                        <Text variante="option" style={{ color: colores.azul }}>
                                            {item.nombre}
                                        </Text>
                                        <div className="flex gap-4 mt-2">
                                            <Text variante="body" style={{ color: colores.gris }}>
                                                {item.nombre_categoria}
                                            </Text>
                                            <Text variante="body" style={{ color: colores.gris }}>
                                                {item.cantidad} {item.unidad}
                                            </Text>
                                            <Text variante="body" style={{ color: colores.gris }}>
                                                {item.stock_recomendado} {item.unidad}
                                            </Text>
                                        </div>
                                    </div>

                                    {/* Vista desktop */}
                                    <div className="hidden md:block px-4 py-4">
                                        <Text variante="body" style={{ color: colores.azul, fontWeight: "600" }}>
                                            {item.nombre}
                                        </Text>
                                    </div>
                                    <div className="hidden md:block px-4 py-4">
                                        <Text variante="body" style={{ color: colores.gris }}>
                                            {item.nombre_categoria}
                                        </Text>
                                    </div>
                                    <div className="hidden md:block px-4 py-4">
                                        <Text variante="body" style={{ color: colores.gris }}>
                                            {item.cantidad} {item.unidad}
                                        </Text>
                                    </div>
                                    <div className="hidden md:block px-4 py-4">
                                        <Text variante="body" style={{ color: colores.gris }}>
                                            {item.stock_recomendado} {item.unidad}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Base>
        </>
    );
};

export default Inventario;
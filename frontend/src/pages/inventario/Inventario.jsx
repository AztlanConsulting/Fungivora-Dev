import React, { useState } from "react";
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/titulo";
import Text from "../../shared/components/ui/basics/texto";
import { colores } from "../../shared/components/ui/basics/colores";
import useInsumos from "../../features/inventario/hooks/useInsumos";

import Input from "../../shared/components/ui/inputs/input_texto";
import SelectField from "../../shared/components/ui/inputs/seleccionar_texto";
import Button from "../../shared/components/ui/buttons/botones";

import { HugeiconsIcon } from "@hugeicons/react";
import { PlusMinus02Icon } from "@hugeicons/core-free-icons";

const colorBordeHeader = "#F2F2FC";

const columnasHeader = [
  { label: "Insumo", key: "nombre" },
  { label: "Cantidad Actual", key: "cantidad" },
  { label: "Estado", key: "estado" },
  { label: "Acciones", key: "accion" },
];

const Inventario = () => {
  const { insumos, unidades, loading, addInsumo, updateInsumo } = useInsumos();
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [nuevaFila, setNuevaFila] = useState({ nombre: "", cantidad: "", stock_recomendado: "", unidad: "" });
  const [errorValidacion, setErrorValidacion] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);

  // Lógica de etiquetas de estado
  const obtenerEstado = (cantidad, recomendado) => {
    const cant = parseFloat(cantidad) || 0;
    const rec = parseFloat(recomendado) || 0;

    if (cant <= 0) {
      return { label: "Agotado", color: "#EF4444", bg: "#FEE2E2" }; 
    }
    if (cant <= rec * 0.5) {
      return { label: "Bajo", color: "#F59E0B", bg: "#FEF3C7" }; 
    }
    return { label: "Óptimo", color: "#10B981", bg: "#D1FAE5" };
  };

  // Agregar un nueva fila
  const handleNuevaFila = (campo, valor) => {
    setNuevaFila((prev) => ({ ...prev, [campo]: valor }));
  };

  // Que se guarde en insumo con todos los campos
  const handleGuardarInsumo = async () => {
    const { nombre, cantidad, stock_recomendado, unidad } = nuevaFila;
    if (!nombre.trim() || !cantidad || !stock_recomendado || !unidad) {
      setErrorValidacion("Por favor, completa todos los campos");
      return;
    }
    setErrorValidacion("");
    const exito = await addInsumo(nuevaFila);
    if (exito) {
      setNuevaFila({ nombre: "", cantidad: "", stock_recomendado: "", unidad: "" });
      setVerFormulario(false);
    }
  };

  const gridLayout = "grid-cols-1 md:grid-cols-[1.5fr_1.8fr_1fr_1fr]";

  return (
    <>
      <Titulo>Inventario</Titulo>
      <Base margen_arriba="mt-24 md:mt-20">
        
        {/* Boton de moviles para abrir el forms */}
        <div className="lg:hidden w-full mb-6">
            <div
                onClick={() => setVerFormulario(!verFormulario)}
                className={`px-6 py-2 rounded-[30px] transition-all duration-300 cursor-pointer inline-flex items-center justify-center border-2 
                ${verFormulario 
                    ? "bg-white border-[#3b3fb6] shadow-sm" 
                    : "bg-white border-gray-200 hover:border-gray-300"}`}
            >
                <Text 
                variante="label" 
                style={{ 
                    color: verFormulario ? colores.azul : "#6B7280", 
                    fontWeight: "500",
                    fontSize: "14px",
                    letterSpacing: "0.5px"
                }}
                >
                {verFormulario ? "Inventario" : "Crear insumo"}
                </Text>
            </div>
            </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Tabla de desktop*/}
          <div className={`w-full lg:flex-1 bg-white rounded-[32px] shadow-sm border p-4 md:p-8 ${verFormulario ? "hidden" : "block"} lg:block`}>
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Text variante="medium">Cargando...</Text>
              </div>
            ) : (
              <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>

            {/* Header */}
            <div 
            className={`hidden md:grid ${gridLayout} items-center min-h-[60px]`} 
            style={{ backgroundColor: colorBordeHeader }}
            >
            {columnasHeader.map((col, i) => (
                <div key={i} className="px-6 flex items-center">
                <Text 
                    variante="medium" 
                    style={{ 
                    color: colores.azul, 
                    fontWeight: "600", 
                    fontSize: "16px",
                    lineHeight: "4" 
                    }}
                >
                    {col.label}
                </Text>
                </div>
            ))}
            <div className="px-6" />
            </div>

                {/* Cuerpo de la tabla */}
                    <div className="max-h-[550px] overflow-y-auto flex flex-col gap-4 md:gap-0">
                    {insumos.map((item) => {
                        const esSeleccionado = filaSeleccionada === item.id_insumo;
                        const estado = obtenerEstado(item.cantidad, item.stock_recomendado);

                        return (
                        <div
                            key={item.id_insumo}
                            onClick={() => setFilaSeleccionada(item.id_insumo)}
                            className="group cursor-pointer"
                        >
                        {/* Vista de desktop*/}
                        <div className={`hidden md:grid ${gridLayout} items-center`}>
                          <div className="px-6 py-4">
                            <Text variante="option" style={{ color: "black", fontWeight: "600", fontSize: "15px"}}>{item.nombre}</Text>
                          </div>
                          <div className="px-8 py-4">
                            <Text variante="option" style={{ color: colores.black, fontWeight: "400", fontSize: "15px" }}>
                              {item.cantidad} - {item.unidad}
                            </Text>
                          </div>
                          <div className="px-8 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold inline-block" style={{ backgroundColor: estado.bg, color: estado.color }}>
                              {estado.label}
                            </span>
                          </div>
                          <div className=" flex justify-center">
                            <HugeiconsIcon icon={PlusMinus02Icon} size={20} color={colores.azul} />
                          </div>
                        </div>

                        {/* Vista de moviles*/}
                        <div className="md:hidden p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <Text variante="option" style={{ color: "black", fontWeight: "600" }}>{item.nombre}</Text>
                            <HugeiconsIcon icon={PlusMinus02Icon} size={22} color={colores.azul} />
                          </div>

                          <div className="flex justify-left items-center border-t pt-2 gap-2" style={{ borderColor: colorBordeHeader }}>
                            <span className="px-4 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider" style={{ backgroundColor: estado.bg, color: estado.color }}>
                              {estado.label}
                            </span>
                            <Text variante="label" style={{ color: "black", fontWeight: "400", fontSize: "13px" }}> {item.cantidad} - {item.unidad}</Text>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Formulario de añadir */}
          <div className={`w-full lg:w-[440px] bg-white rounded-[32px] shadow-sm border p-8 flex flex-col ${verFormulario ? "block" : "hidden"} lg:block`}>
            <div className="mb-8">
              <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Insumo</Text>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Nombre del insumo</Text>
                <Input 
                  placeholder="Ej. Harina de Trigo"
                  value={nuevaFila.nombre}
                  onChange={(e) => handleNuevaFila("nombre", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Stock Actual</Text>
                <Input 
                  variante="numero"
                  placeholder="0.00"
                  value={nuevaFila.cantidad}
                  onChange={(e) => handleNuevaFila("cantidad", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Stock Recomendado </Text>
                <Input 
                  variante="numero"
                  placeholder="0.00"
                  value={nuevaFila.stock_recomendado}
                  onChange={(e) => handleNuevaFila("stock_recomendado", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Unidad de Medida</Text>
                <SelectField 
                  placeholder="Selecciona unidad"
                  size = "forms"
                  value={nuevaFila.unidad}
                  onChange={(e) => handleNuevaFila("unidad", e.target.value)}
                  options={unidades.map(u => ({ value: u.opcion, label: u.opcion }))}
                />
              </div>

            {errorValidacion && (
              <div className="text-center">
                <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{errorValidacion}</Text>
              </div>
            )}

              <div className="flex justify-center pt-4">
                <Button 
                  variant="primario" 
                  size="lg" 
                  onClick={handleGuardarInsumo}
                  className="w-full"
                >
                  Crear Insumo
                </Button>
              </div>
            </div>
          </div>

        </div>
      </Base>
    </>
  );
};

export default Inventario;
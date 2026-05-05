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
  { label: "Stock Recomendado", key: "stock_recomendado" },
];

const Inventario = () => {
  const { insumos, unidades, loading, addInsumo, updateInsumo } = useInsumos();
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [nuevaFila, setNuevaFila] = useState({ nombre: "", cantidad: "", stock_recomendado: "", unidad: "" });
  const [errorValidacion, setErrorValidacion] = useState("");
  
  // ESTADO PARA EL SWITCH EN MÓVIL
  const [verFormulario, setVerFormulario] = useState(false);

  const handleNuevaFila = (campo, valor) => {
    setNuevaFila((prev) => ({ ...prev, [campo]: valor }));
  };

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
      setVerFormulario(false); // Volver a la tabla tras guardar en móvil
    }
  };

  const gridLayout = "grid-cols-1 md:grid-cols-[1.5fr_1.7fr_1.6fr_200px]";

  return (
    <>
      <Titulo>Inventario</Titulo>
      <Base margen_arriba="mt-24 md:mt-20">
        
        {/* BOTÓN SWITCH (SOLO MÓVIL) */}
        <div className="lg:hidden w-full mb-6">
          <div
            onClick={() => setVerFormulario(!verFormulario)}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer inline-flex items-center justify-center border-2 
              ${verFormulario ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"}`}
          >
            <Text variante="label" style={{ color: verFormulario ? colores.azul : colores.gris, fontWeight: "600" }}>
              {verFormulario ? "Ver Inventario" : "Crear Insumo"}
            </Text>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* SECCIÓN IZQUIERDA: TABLA (Se oculta en móvil si verFormulario es true) */}
          <div className={`w-full lg:flex-1 bg-white rounded-[32px] shadow-sm border p-4 md:p-8 ${verFormulario ? "hidden" : "block"} lg:block`}>
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Text variante="medium">Cargando...</Text>
              </div>
            ) : (
              <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
                <div className={`hidden md:grid ${gridLayout}`} style={{ backgroundColor: colorBordeHeader }}>
                  {columnasHeader.map((col, i) => (
                    <div key={i} className="px-6 py-4">
                      <Text variante="medium" style={{ color: colores.azul, fontWeight: "600", fontSize: "18px" }}>{col.label}</Text>
                    </div>
                  ))}
                  <div className="px-6 py-4" />
                </div>

                <div className="max-h-[550px] overflow-y-auto flex flex-col gap-3 md:gap-0">
                  {insumos.map((item) => (
                    <div key={item.id_insumo} onClick={() => setFilaSeleccionada(item.id_insumo)}
                      className={`transition-all border-b items-center cursor-pointer ${filaSeleccionada === item.id_insumo ? "bg-slate-50" : "bg-white"}`}
                      style={{ borderColor: colorBordeHeader }}>
                      
                      {/* Desktop Row */}
                      <div className={`hidden md:grid ${gridLayout} items-center`}>
                        <div className="px-6 py-4"><Text variante="option" style={{ color: "black", fontWeight: "600", fontSize: "16px"}}>{item.nombre}</Text></div>
                        <div className="px-8 py-4"><Text variante="option" style={{ color: colores.black, fontWeight: "400", fontSize: "16px" }}>{item.cantidad} {item.unidad}</Text></div>
                        <div className="px-9 py-4"><Text variante="option" style={{ color: colores.black, fontWeight: "400", fontSize: "16px" }}>{item.stock_recomendado} {item.unidad}</Text></div>
                        <div className="px-6 py-4 flex justify-center"><HugeiconsIcon icon={PlusMinus02Icon} size={24} color={colores.azul} /></div>
                      </div>

                        {/* Móvil Row */}
                        <div className="md:hidden p-4 flex flex-col gap-3">
                        
                        {/* Fila Superior: Nombre e Icono */}
                        <div className="flex justify-between items-center">
                            <Text variante="option" style={{ color: "black", fontWeight: "600" }}>
                            {item.nombre}
                            </Text>
                            <HugeiconsIcon icon={PlusMinus02Icon} size={24} color={colores.azul} />
                        </div>

                        {/* Fila Inferior: Datos uno al lado del otro */}
                        <div className="flex gap-4 border-t pt-2" style={{ borderColor: colorBordeHeader }}>
                            <div className="flex flex-col">
                            <Text variante="label" style={{ color: colores.gris, fontWeight: "400", fontSize: "12px" }}>
                                {item.cantidad} {item.unidad}
                            </Text>
                            </div>
                            
                            <div className="flex flex-col">
                            <Text variante="label" style={{ color: colores.gris, fontWeight: "400", fontSize: "12px"  }}>
                                {item.stock_recomendado} {item.unidad}
                            </Text>
                            </div>
                        </div>

                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN DERECHA: FORMULARIO (Se oculta en móvil si verFormulario es false) */}
          <div className={`w-full lg:w-[450px] bg-white rounded-[32px] shadow-sm border p-8 flex flex-col ${verFormulario ? "block" : "hidden"} lg:block`}>
            <div className="mb-8">
              <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "24px" }}>Crear Insumo</Text>
            </div>

            {errorValidacion && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 mb-6 text-center">
                <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{errorValidacion}</Text>
              </div>
            )}

            <div className="flex flex-col flex-1 justify-between gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Nombre del insumo</Text>
                  <Input 
                    placeholder="Ej. Harina de Trigo"
                    value={nuevaFila.nombre}
                    onChange={(e) => handleNuevaFila("nombre", e.target.value)}
                    className="w-full"
                  />
                </div>

                  <div className="flex flex-col gap-2 ">
                    <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Stock Actual</Text>
                    <Input 
                      variante="numero"
                      placeholder="0.00"
                      value={nuevaFila.cantidad}
                      onChange={(e) => handleNuevaFila("cantidad", e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Stock Recomendado</Text>
                    <Input 
                      variante="numero"
                      placeholder="0.00"
                      value={nuevaFila.stock_recomendado}
                      onChange={(e) => handleNuevaFila("stock_recomendado", e.target.value)}
                      className="w-full"
                    />
                </div>

                <div className="flex flex-col gap-2">
                  <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Unidad de Medida</Text>
                  <SelectField 
                    placeholder="Selecciona unidad"
                    value={nuevaFila.unidad}
                    onChange={(e) => handleNuevaFila("unidad", e.target.value)}
                    options={unidades.map(u => ({ value: u.opcion, label: u.opcion }))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  variant="eliminar" 
                  size="lg" 
                  onClick={handleGuardarInsumo}
                  className="w-full max-w-xs"
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
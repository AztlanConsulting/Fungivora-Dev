import React, { useState } from "react";
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/titulo";
import Text from "../../shared/components/ui/basics/texto";
import { colores } from "../../shared/components/ui/basics/colores";
import useLotes from "../../features/lotes/hooks/useLotes";

import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

function Lotes() {
  const { datos, cargando, error } = useLotes();
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  // Colores de las etiquetas de las fases
  const obtenerEstiloFase = (fase) => {
    const f = fase?.toLowerCase() || "";
    if (f.includes("cosecha")) return { bg: "#E8F5E9", text: "#2E7D32" };
    if (f.includes("inoculación")) return { bg: "#FFEBEE", text: "#C62828" };
    if (f.includes("colonización")) return { bg: "#FFF3E0", text: "#EF6C00" };
    if (f.includes("finalización") || f.includes("finalizado")) return { bg: "#E3F2FD", text: "#1565C0" };
    if (f.includes("fructificación")) return { bg: "#fff5cc", text: "#c7a200" };
    return { bg: "#F5F5F5", text: "#616161" };
  };

  // Color del header
  const colorBordeHeader = "#F2F2FC";
 
  // Nombres de las columnas
  const columnas = [
    { label: "Código de Lote", key: "codigo_fungivora" },
    { label: "Sustrato", key: "tipo_sustrato" },
    { label: "Ubicación", key: "ubicacion_lote" },
    { label: "Estado", key: "fase" },
    { label: "Fecha", key: "fecha_lote" }
  ];

  return (
    <>
      <Titulo>Lotes</Titulo>

      <Base margen_arriba="mt-24 md:mt-20">
        <div className="w-full bg-white rounded-[32px] shadow-sm border p-4 md:p-8 min-h-[500px]">
  
          {/* Manejo de estados */}
          {cargando && datos.length === 0 ? (
            <div className="flex justify-center items-center h-[400px]">
              <Text variante="medium">Cargando lotes...</Text>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[400px]">
              <Text variante="medium" style={{ color: 'red' }}>Error al conectar con el servidor</Text>
            </div>
          ) : (
            <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
              
              {/* Header*/}
              <div className="hidden md:grid md:grid-cols-6" style={{ backgroundColor: colorBordeHeader }}>
                {columnas.map((col, i) => (
                  <div key={i} className="px-6 py-4">
                    <Text variante="medium" style={{ color: colores.azul, fontWeight: '600' }}>{col.label}</Text>
                  </div>
                ))}
                <div className="px-6 py-4"></div>
              </div>

              {/* Contenedor de datos */}
              <div className="max-h-[680px] md:max-h-[530px] overflow-y-auto bg-transparent md:bg-white flex flex-col gap-3 md:gap-0">
                {datos.map((lote) => {
                  const esSeleccionado = filaSeleccionada === lote.id_lote;
                  const fechaFormateada = new Date(lote.fecha_lote).toLocaleDateString();
                  const estiloFase = obtenerEstiloFase(lote.fase);

                  return (
                    <div key={lote.id_lote} onClick={() => setFilaSeleccionada(lote.id_lote)}>
                      
                      {/* Vista Móvil*/}
                        <div 
                        className={`md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-4 transition-all ${esSeleccionado ? 'ring-2' : ''}`}
                        style={{ 
                            borderColor: esSeleccionado ? colores.azul : colorBordeHeader,
                            boxShadow: esSeleccionado ? `0 4px 15px rgba(0,0,0,0.08)` : '0 2px 4px rgba(0,0,0,0.04)'
                        }}
                        >
                        {/* Fila Superior */}
                        <div className="flex justify-between items-start">
                            <Text variante="option" style={{ color: colores.black, fontWeight: '500', fontSize: '18px' }}>
                            {lote.codigo_fungivora}
                            </Text>
                            <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} className="cursor-pointer" />
                        </div>

                        {/* Fila de Datos*/}
                        <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                            
                            <div className="flex flex-col gap-1">
                            <Text variante="option" style={{ color: colores.gris, fontSize: '14px', fontWeight: '400' }}>
                                {lote.tipo_sustrato}
                            </Text>
                            </div>

                            <div className="flex flex-col gap-1">
                             <Text variante="option" style={{ color: colores.gris, fontSize: '14px', fontWeight: '400' }}>
                                {lote.ubicacion_lote}
                            </Text>
                            </div>

                            <div className="flex flex-col gap-1">
                        <div>
                                <span className="px-2 py-0.5 rounded-md text-[12px] font-medium" 
                                    style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                                {lote.fase}
                                </span>
                            </div>
                            </div>

                            <div className="flex flex-col gap-1">
                        <Text variante="option" style={{color: colores.gris, fontSize: '14px', fontWeight: '400' }}>
                                {fechaFormateada}
                            </Text>
                            </div>

                        </div>
                        </div>

                      {/* Vista Desktop*/}
                      <div
                        className={`hidden md:grid md:grid-cols-6 cursor-pointer transition-all relative ${esSeleccionado ? 'z-10' : 'border-b'}`}
                        style={{ 
                          borderColor: colorBordeHeader,
                          boxShadow: esSeleccionado ? `inset 0 0 0 2px ${colores.azul}` : 'none',
                          backgroundColor: 'white'
                        }}
                      >
                        {columnas.map((col, i) => (
                          <div key={i} className="px-6 py-5 flex items-center">
                            {col.key === 'fase' ? (
                              <div className="px-4 py-1 rounded-lg inline-block text-sm font-medium" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                                {lote[col.key]}
                              </div>
                            ) : (
                              <Text variante="option" style={{ color: "black", fontWeight: col.key === 'codigo_fungivora' ? '600' : '400' }}>
                                {col.key === 'fecha_lote' ? fechaFormateada : lote[col.key]}
                              </Text>
                            )}
                          </div>
                        ))}
                        <div className="px-6 py-5 ">
                          <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} className="cursor-pointer hover:opacity-80 transition-opacity" />
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
}

export default Lotes;
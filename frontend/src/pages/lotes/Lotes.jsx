import React, { useState, useEffect, useCallback } from "react";
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/titulo";
import Text from "../../shared/components/ui/basics/texto";
import { colores } from "../../shared/components/ui/basics/colores";

import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

function Lotes() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  
  // Para mandar a llamar los datos ordenados
  const obtenerLotes = useCallback(async () => {
    try {
      const response = await fetch('/api/lotes'); 
      const resultado = await response.json();

      if (resultado.success) {
        const datosOrdenados = resultado.data.sort((a, b) => {
          return new Date(b.fecha_lote) - new Date(a.fecha_lote);
        });
        setDatos(datosOrdenados);
      }
    } catch (error) {
      console.error("Error al cargar lotes:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  // Cargar nuevos datos o cambios en 5 segs
  useEffect(() => {
    obtenerLotes();
    const intervalo = setInterval(() => {
      obtenerLotes();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [obtenerLotes]);

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

  // Columnas de esta tabla
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
        <div className="w-full bg-white rounded-[32px] shadow-sm border p-4 md:p-8 md:pl-16 min-h-[500px]">
          <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
            
            {/* Área del header */}
            <div className="hidden md:grid md:grid-cols-6" style={{ backgroundColor: colorBordeHeader }}>
              {columnas.map((col, i) => (
                <div key={i} className="px-6 py-4">
                  <Text variante="medium" style={{ color: colores.azul, fontWeight: '600' }}>{col.label}</Text>
                </div>
              ))}
              <div className="px-6 py-4"></div>
            </div>

            {/* Tabla de moviles */}
            <div className="max-h-[680px] md:max-h-[530px] overflow-y-auto bg-transparent md:bg-white flex flex-col gap-3 md:gap-0">
              {!cargando && datos.map((lote) => {
                const esSeleccionado = filaSeleccionada === lote.id_lote;
                const fechaFormateada = new Date(lote.fecha_lote).toLocaleDateString();
                const estiloFase = obtenerEstiloFase(lote.fase);

                return (
                  <div key={lote.id_lote} onClick={() => setFilaSeleccionada(lote.id_lote)}>
                    
                    <div 
                      className={`md:hidden p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3 transition-all ${esSeleccionado ? 'ring-2' : ''}`}
                      style={{ 
                        borderColor: esSeleccionado ? colores.azul : colorBordeHeader,
                        boxShadow: esSeleccionado ? `0 4px 12px rgba(0,0,0,0.1)` : '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <Text variante="option" style={{ color: "black", fontWeight: '600', fontSize: '16px' }}>
                          {lote.codigo_fungivora}
                        </Text>
                        <HugeiconsIcon 
                          icon={CancelCircleIcon} 
                          size={24} 
                          color={colores.azul} 
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="flex flex-row flex-wrap items-center gap-4 border-t pt-3" style={{ borderColor: colorBordeHeader }}>
                        <Text variante="option" style={{ color: "black", opacity: 0.7, fontWeight: '400', fontSize: '13px' }}>
                          {lote.ubicacion_lote}
                        </Text>
                        <Text variante="option" style={{ color: "black", opacity: 0.7, fontWeight: '400', fontSize: '13px' }}>
                          {lote.tipo_sustrato}
                        </Text>
                        <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-wider" 
                              style={{ backgroundColor: estiloFase.bg, fontWeight: '400', color: estiloFase.text }}>
                          {lote.fase}
                        </span>
                        <Text variante="option" style={{ color: "black", opacity: 0.7, fontWeight: '400', fontSize: '13px' }}>
                          {fechaFormateada}
                        </Text>
                      </div>
                    </div>

                    <div
                      className={`hidden md:grid md:grid-cols-6 cursor-pointer transition-all relative ${esSeleccionado ? 'z-10' : 'border-b'}`}
                      style={{ 
                        borderColor: colorBordeHeader,
                        boxShadow: esSeleccionado ? `inset 0 0 0 2px ${colores.azul}` : 'none',
                        backgroundColor: 'white'
                      }}
                    >
                    
                     {/* Tabla de desktop */}
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
                      <div className="px-6 py-5 justify-end">
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
        </div>
      </Base>
    </>
  );
}

export default Lotes;
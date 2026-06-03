import React from "react";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

const TablaBloques = ({ bloques, onEliminar, estilosTipo, colorBordeHeader, gridLayout }) => {
  const layout = gridLayout || "grid-cols-[1.1fr_1fr_1fr_0.8fr_1fr_0.6fr_0.4fr]";

  const cellClass = "px-6 py-4 flex items-center min-w-0";

  const formatearPeso = (gramos) => {
    const pesoNum = Number(gramos);
    if (pesoNum >= 1000) {
      return `${(pesoNum / 1000).toFixed(1).replace(/\.0$/, "")} Kilogramo(s)`;
    }
    return `${pesoNum} Gramo(s)`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Contenedor principal*/}
      <div className="flex flex-col min-[1450px]:border min-[1450px]:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>

        {/* Header Desktop */}
        <div className={`hidden min-[1450px]:grid ${layout}`} style={{ backgroundColor: colorBordeHeader }}>
          <div className={cellClass}><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Inóculo</Text></div>
          <div className={cellClass}><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Sustrato</Text></div>
          <div className={cellClass}><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Tamaño</Text></div>
          <div className={cellClass}><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Peso</Text></div>
          <div className={cellClass}><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Clasificación</Text></div>
          <div className={cellClass}><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Cantidad</Text></div>
          <div className={`${cellClass} justify-center`}><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Eliminar</Text></div>
        </div>

        {/* Lista de registros */}
        <div className="max-h-[605px] min-[1450px]:max-h-[550px] overflow-y-auto flex flex-col gap-1 min-[1200px]:gap-0">
          {bloques && bloques.length > 0 ? (
            bloques.map((bloque) => {
              const esProd = Number(bloque.produccion) === 1;
              const estilo = esProd ? estilosTipo.produccion : estilosTipo.experimental;
              
              const nombreInoculo = bloque.nombre_inoculo || "Sin código"; 
              const nombreContenedor = typeof bloque.contenedor === 'object' ? (bloque.contenedor.label || bloque.contenedor.value) : bloque.contenedor;
              const nombreSustrato = typeof bloque.tipo_sustrato === 'object' ? (bloque.tipo_sustrato.label || bloque.tipo_sustrato.value) : bloque.tipo_sustrato || "No asignado";

              return (
                <div key={bloque.id_temp} className="w-full">
                  {/* Fila Desktop */}
                  <div className={`hidden min-[1450px]:grid ${layout} border-b hover:bg-slate-50`} style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}>
                    <div className={cellClass}><Text variante="option" style={{ color: "black", fontSize: "14px", fontWeight: '600' }} className="truncate">{nombreInoculo}</Text></div>
                    <div className={cellClass}><Text variante="option" style={{ color: "black", fontSize: "14px" }} className="truncate">{nombreSustrato}</Text></div>
                    <div className={cellClass}><Text variante="option" style={{ color: "black", fontSize: "14px" }} className="truncate">{nombreContenedor}</Text></div>
                    <div className={cellClass}><Text variante="option" style={{ color: "black", fontSize: "14px" }} className="truncate">{formatearPeso(bloque.peso_gr)}</Text></div>
                    <div className={cellClass}>
                      <span className="px-2 py-1 rounded-md text-[10px] font-semibold border uppercase tracking-wider inline-block truncate" style={{ backgroundColor: estilo.bg, color: estilo.text }}>
                        {esProd ? "Producción" : "Experimental"}
                      </span>
                    </div>
                    <div className={cellClass}><Text variante="option" style={{ color: "black", fontSize: "14px" }} className="truncate">{bloque.cantidad} pzs</Text></div>
                    <div className={`${cellClass} justify-center`}>
                      <button onClick={() => onEliminar(bloque.id_temp)} className="text-[#3b3fb6] hover:opacity-70 transition-opacity">
                        <HugeiconsIcon icon={CancelCircleIcon} size={22} />
                      </button>
                    </div>
                  </div>

                  {/* Vista en Móvil */}
                  <div className="block min-[1450px]:hidden p-5 rounded-2xl border bg-white shadow-sm flex-col gap-3 mx-2 mb-1" style={{ borderColor: colorBordeHeader }}>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <Text variante="option" style={{ color: "black", fontWeight: '600', fontSize: '15px' }}>{nombreContenedor} — <span className="font-normal text-gray-600">{nombreSustrato}</span></Text>
                        <Text variante="option" style={{ color: "black", fontSize: '12px', fontWeight: '400' }}>{nombreInoculo}</Text>
                      </div>
                      <button onClick={() => onEliminar(bloque.id_temp)} className="p-1 text-[#3b3fb6]"><HugeiconsIcon icon={CancelCircleIcon} size={24} /></button>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 border-t pt-3" style={{ borderColor: colorBordeHeader }}>
                        <span>{formatearPeso(bloque.peso_gr)} - {bloque.cantidad} piezas</span>
                        <span className="px-2 py-1 rounded-md text-[10px] font-semibold border uppercase tracking-wider inline-block truncate" style={{ backgroundColor: estilo.bg, color: estilo.text }}>
                          {esProd ? "Producción" : "Experimental"}
                        </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white">
              <Text variante="medium" style={{ color: colores.black, fontWeight: "400", textAlign: "center" }}>
                Aún no hay bloques registrados
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TablaBloques;
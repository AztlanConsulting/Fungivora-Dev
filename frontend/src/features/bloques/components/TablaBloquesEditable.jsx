import React from "react";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

const TablaBloques = ({ bloques, onEliminar, estilosTipo, colorBordeHeader }) => {
  
  const layout = "min-[1587px]:grid-cols-[1.3fr_1fr_1fr_1.1fr_1.1fr_0.8fr_0.5fr]";

  const formatearPeso = (gramos) => {
    const pesoNum = Number(gramos);
    if (pesoNum >= 1000) {
      return `${(pesoNum / 1000).toFixed(1).replace(/\.0$/, "")} Kilogramo(s)`;
    }
    return `${pesoNum} Gramo(s)`;
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col min-[1587px]:border min-[1587px]:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>

        {/* Header de la tabla (solo laptop) */}
        <div className={`hidden min-[1587px]:grid ${layout}`} style={{ backgroundColor: colorBordeHeader }}>
          {["Inóculo", "Sustrato", "Tamaño", "Peso", "Clasificación", "Cantidad"].map((label) => (
            <div key={label} className="px-5 py-4 flex items-center min-w-0">
              <Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600', whiteSpace: 'nowrap' }}>{label}</Text>
            </div>
          ))}
          <div className="px-4 py-4 flex items-center justify-center min-w-0">
            <Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600', whiteSpace: 'nowrap' }}>Eliminar</Text>
          </div>
        </div>

        <div className="max-h-[605px] min-[1587px]:max-h-[550px] overflow-y-auto flex flex-col gap-3 min-[1587px]:gap-0">
          {bloques.length > 0 ? (
            bloques.map((bloque) => {
              const esProd = Number(bloque.produccion) === 1;
              const estilo = esProd ? estilosTipo.produccion : estilosTipo.experimental;

              const nombreInoculo = bloque.nombre_inoculo || "Sin código";
              const nombreContenedor = typeof bloque.contenedor === 'object' ? (bloque.contenedor.label || bloque.contenedor.value) : bloque.contenedor;
              const nombreSustrato = typeof bloque.tipo_sustrato === 'object' ? (bloque.tipo_sustrato.label || bloque.tipo_sustrato.value) : bloque.tipo_sustrato || "No asignado";

              return (
                <div key={bloque.id_temp} className="w-full">
                  {/* Vista laptop (>= 1200px) */}
                  <div className={`hidden min-[1587px]:grid ${layout} border-b hover:bg-slate-50 items-center`} style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}>
                    <div className="px-5 py-5 min-w-0"><div className="truncate"><Text variante="option" style={{ color: "black", fontSize: "14px", fontWeight: '600' }}>{nombreInoculo}</Text></div></div>
                    <div className="px-5 py-5 min-w-0"><div className="truncate"><Text variante="option" style={{ color: "black", fontSize: "14px" }}>{nombreSustrato}</Text></div></div>
                    <div className="px-5 py-5 min-w-0"><div className="truncate"><Text variante="option" style={{ color: "black", fontSize: "14px" }}>{nombreContenedor}</Text></div></div>
                    <div className="px-5 py-5 min-w-0"><div className="truncate"><Text variante="option" style={{ color: "black", fontSize: "14px" }}>{formatearPeso(bloque.peso_gr)}</Text></div></div>
                    <div className="px-5 py-5 min-w-0">
                      <span className="px-2 py-1 rounded-md text-[10px] font-semibold border uppercase tracking-wider whitespace-nowrap" style={{ backgroundColor: estilo.bg, color: estilo.text }}>
                        {esProd ? "Producción" : "Experimental"}
                      </span>
                    </div>
                    <div className="px-5 py-5 min-w-0"><div className="truncate"><Text variante="option" style={{ color: "black", fontSize: "14px" }}>{bloque.cantidad} pzs</Text></div></div>
                    <div className="px-4 py-5 flex justify-center">
                      <button onClick={() => onEliminar(bloque.id_temp)} className="text-[#3b3fb6] hover:opacity-70 transition-opacity">
                        <HugeiconsIcon icon={CancelCircleIcon} size={22} />
                      </button>
                    </div>
                  </div>

                  {/* Vista móvil / tablet (< 1200px) */}
                  <div className="min-[1587px]:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-3 mx-1 mb-1" style={{ borderColor: colorBordeHeader }}>
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex flex-col gap-1 min-w-0">
                        <Text variante="option" style={{ color: "black", fontWeight: '600', fontSize: '15px' }}>{nombreContenedor} — <span className="font-normal text-gray-600">{nombreSustrato}</span></Text>
                        <Text variante="option" style={{ color: "black", fontSize: '12px', fontWeight: '400' }}>{nombreInoculo}</Text>
                      </div>
                      <button onClick={() => onEliminar(bloque.id_temp)} className="shrink-0 p-1 text-[#3b3fb6]"><HugeiconsIcon icon={CancelCircleIcon} size={24} /></button>
                    </div>
                    <div className="flex justify-between items-center gap-3 border-t pt-3" style={{ borderColor: colorBordeHeader }}>
                      <Text variante="option" style={{color: colores.gris, fontWeight: '400',fontSize: '13px' }}>{formatearPeso(bloque.peso_gr)} — {bloque.cantidad} piezas</Text>
                      <span className="shrink-0 px-2 py-1 rounded-md text-[10px] font-semibold border uppercase" style={{ backgroundColor: estilo.bg, color: estilo.text }}>
                        {esProd ? "Prod" : "Exp"}
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
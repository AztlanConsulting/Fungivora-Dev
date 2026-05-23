import React from "react";
import Text from "../../../shared/components/ui/basics/texto";
import { colores } from "../../../shared/components/ui/basics/colores";
import Titulo from "../../../shared/components/ui/basics/titulo";
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

const TablaBloques = ({ bloques, onEliminar, estilosTipo, colorBordeHeader }) => {
  
  const layout = "md:grid-cols-[1.2fr_1fr_0.8fr_1.1fr_0.8fr_0.5fr]";

  const formatearPeso = (gramos) => {
    const pesoNum = Number(gramos);
    if (pesoNum >= 1000) {
      return `${(pesoNum / 1000).toFixed(1).replace(/\.0$/, "")} Kilogramo(s)`;
    }
    return `${pesoNum} Gramo(s)`;
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
        
        {/* Header de la tabla */}
        <div className={`hidden md:grid ${layout}`} style={{ backgroundColor: colorBordeHeader }}>
          <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Inóculo</Text></div>
          <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Tamaño</Text></div>
          <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Peso</Text></div>
          <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Clasificación</Text></div>
          <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Cantidad</Text></div>
          <div className="px-6 py-4 text-center"><Text variante="medium" style={{ color: colores.azul, fontSize: "15px", fontWeight: '600' }}>Eliminar</Text></div>
        </div>

        <div className="max-h-[605px] md:max-h-[550px] overflow-y-auto flex flex-col gap-3 md:gap-0">
          {bloques.length > 0 ? (
            bloques.map((bloque) => {
              const esProd = Number(bloque.produccion) === 1;
              const estilo = esProd ? estilosTipo.produccion : estilosTipo.experimental;
              
              const nombreInoculo = bloque.nombre_inoculo || "Sin código"; 
              const nombreContenedor = typeof bloque.contenedor === 'object' ? (bloque.contenedor.label || bloque.contenedor.value) : bloque.contenedor;

              return (
                <div key={bloque.id_temp} className="w-full">
                  {/* Vista en desktop */}
                  <div className={`hidden md:grid ${layout} border-b hover:bg-slate-50 items-center`} style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}>
                    <div className="px-6 py-5"><Text variante="option" style={{ color: "black", fontSize: "14px", fontWeight: '600' }}>{nombreInoculo}</Text></div>
                    <div className="px-6 py-5"><Text variante="option" style={{ color: "black", fontSize: "14px", fontWeight: '600' }}>{nombreContenedor}</Text></div>
                    {/* Peso formateado aquí */}
                    <div className="px-6 py-5"><Text variante="option" style={{ color: "black", fontSize: "14px" }}>{formatearPeso(bloque.peso_gr)}</Text></div>
                    <div className="px-6 py-5">
                      <span className="px-2 py-1 rounded-md text-[10px] font-semibold border uppercase tracking-wider" style={{ backgroundColor: estilo.bg, color: estilo.text }}>
                        {esProd ? "Producción" : "Experimental"}
                      </span>
                    </div>
                    <div className="px-6 py-5"><Text variante="option" style={{ color: "black", fontSize: "14px" }}>{bloque.cantidad} pzs</Text></div>
                    <div className="px-4 py-5 flex justify-center">
                      <button onClick={() => onEliminar(bloque.id_temp)} className="text-[#3b3fb6] hover:opacity-70 transition-opacity">
                        <HugeiconsIcon icon={CancelCircleIcon} size={22} />
                      </button>
                    </div>
                  </div>

                  {/* Vista en Movil */}
                  <div className="md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-3 mx-2 mb-1" style={{ borderColor: colorBordeHeader }}>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <Text variante="option" style={{ color: "black", fontWeight: '600', fontSize: '15px' }}>{nombreContenedor}</Text>
                        <Text variante="option" style={{ color: "black", fontSize: '12px', fontWeight: '400' }}>{nombreInoculo}</Text>
                      </div>
                      <button onClick={() => onEliminar(bloque.id_temp)} className="p-1 text-[#3b3fb6]"><HugeiconsIcon icon={CancelCircleIcon} size={24} /></button>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3" style={{ borderColor: colorBordeHeader }}>
                      {/* Peso formateado aquí */}
                      <Text variante="option" style={{color: colores.gris, fontWeight: '400',fontSize: '13px' }}>{formatearPeso(bloque.peso_gr)} — {bloque.cantidad} piezas</Text>
                      <span className="px-2 py-1 rounded-md text-[10px] font-semibold border uppercase" style={{ backgroundColor: estilo.bg, color: estilo.text }}>
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
import React from "react";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import Titulo from "../../../shared/components/ui/basics/Titulo";
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

// Tabla para poder vizualizar los bloques
const TablaBloques = ({ codigo, bloques, onEliminar, estilosTipo, gridLayout, colorBordeHeader }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Titulo*/}
      <Titulo>Bloques: {codigo}</Titulo>
      <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>

        {/* Header de la tabla */}
        <div className={`hidden md:grid ${gridLayout}`} style={{ backgroundColor: colorBordeHeader }}>
          <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>Tamaño</Text></div>
          <div className="px-8 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>Peso (g)</Text></div>
          <div className="px-9 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>Clasificación</Text></div>
          <div className="px-12 py-4"><Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>Cantidad</Text></div>
          <div className="px-8 py-4 text-center"><Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>Eliminar</Text></div>
        </div>

        <div className="max-h-[605px] md:max-h-[550px] overflow-y-auto flex flex-col gap-3 md:gap-0">
          {bloques.length > 0 ? (
            bloques.map((bloque) => {
              const esProd = Number(bloque.produccion) === 1;
              const estilo = esProd ? estilosTipo.produccion : estilosTipo.experimental;
              const nombreContenedor = typeof bloque.contenedor === 'object' ? (bloque.contenedor.label || bloque.contenedor.value) : bloque.contenedor;

              return (
                <div key={bloque.id_temp} className="w-full">
                  {/* Vista en desktop */}
                  <div className={`hidden md:grid ${gridLayout} border-b hover:bg-slate-50 items-center`} style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}>
                    <div className="px-6 py-5"><Text variante="option" style={{ color: "black", fontSize: "15px", fontWeight: '600' }}>{nombreContenedor}</Text></div>
                    <div className="px-6 py-5"><Text variante="option" style={{ color: "black", fontSize: "15px" }}>{bloque.peso_gr}g</Text></div>
                    <div className="px-4 py-5">
                      <span className="px-2 py-1 rounded-md text-[11px] font-semibold border" style={{ backgroundColor: estilo.bg, color: estilo.text }}>
                        {esProd ? "Producción" : "Experimental"}
                      </span>
                    </div>
                    <div className="px-6 py-5"><Text variante="option" style={{ color: "black", fontSize: "15px" }}>{bloque.cantidad} piezas</Text></div>
                    <div className="px-4 py-5 flex justify-center">
                      <button onClick={() => onEliminar(bloque.id_temp)} className="text-[#3b3fb6] hover:opacity-70 transition-opacity">
                        <HugeiconsIcon icon={CancelCircleIcon} size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Vista en Movil*/}
                  <div className="md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-2 mx-2 mb-1" style={{ borderColor: colorBordeHeader }}>
                    <div className="flex justify-between items-center">
                      <Text variante="option" style={{ color: "black", fontWeight: '600' }}>{nombreContenedor}</Text>
                      <button onClick={() => onEliminar(bloque.id_temp)} className="p-2 text-[#3b3fb6]"><HugeiconsIcon icon={CancelCircleIcon} size={24} /></button>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3" style={{ borderColor: colorBordeHeader }}>
                      <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{bloque.peso_gr}g - {bloque.cantidad} piezas</Text>
                      <span className="px-3 py-1 rounded-md text-[11px] font-semibold border" style={{ backgroundColor: estilo.bg, color: estilo.text }}>
                        {esProd ? "Producción" : "Experimental"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Mensaje de espacio vacio */
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
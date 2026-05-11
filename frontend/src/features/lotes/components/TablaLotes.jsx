import React from "react";
import Text from "../../../shared/components/ui/basics/texto";
import { colores } from "../../../shared/components/ui/basics/colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

const TablaLotes = ({ datos, columnas, onVerDetalle, obtenerEstiloFase, gridLayout, colorBordeHeader }) => {
  return (
    <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
      <div className={`hidden md:grid ${gridLayout}`} style={{ backgroundColor: colorBordeHeader }}>
        {columnas.map((col, i) => (
          <div key={i} className="px-6 py-4">
            <Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>{col.label}</Text>
          </div>
        ))}
        <div className="px-6 py-4"></div>
      </div>

      <div className="max-h-[605px] md:max-h-[550px] overflow-y-auto flex flex-col gap-3 md:gap-0">
        {datos.map((lote) => {
          const estiloFase = obtenerEstiloFase(lote.fase);
          const fechaFormateada = new Date(lote.fecha_lote).toLocaleDateString();

          return (
            <div key={lote.id_lote} className="w-full">
              {/* DESKTOP */}
              <div
                onClick={() => onVerDetalle(lote)}
                className={`hidden md:grid ${gridLayout} cursor-pointer transition-all border-b hover:bg-slate-50`}
                style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}
              >
                {columnas.map((col, i) => (
                  <div key={i} className="px-6 py-5 flex items-center">
                    {col.key === 'fase' ? (
                      <div className="px-4 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                        {lote[col.key]}
                      </div>
                    ) : (
                      <Text variante="option" style={{ color: "black", fontSize: "15px", fontWeight: col.key === 'codigo_fungivora' ? '600' : '400' }}>
                        {col.key === 'fecha_lote' ? fechaFormateada : lote[col.key]}
                      </Text>
                    )}
                  </div>
                ))}
                <div className="py-4 flex justify-center items-center">
                  <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                </div>
              </div>

              {/* MOBILE */}
              <div
                onClick={() => onVerDetalle(lote)}
                className="md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-4 cursor-pointer mb-4 mx-2"
                style={{ borderColor: colorBordeHeader }}
              >
                <div className="flex justify-between items-start">
                  <Text variante="option" style={{ color: "black", fontWeight: '500', fontSize: '18px' }}>{lote.codigo_fungivora}</Text>
                  <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                  <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{lote.tipo_sustrato}</Text>
                  <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{lote.ubicacion_lote}</Text>
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[12px] font-semibold" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                      {lote.fase}
                    </span>
                  </div>
                  <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{fechaFormateada}</Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablaLotes;
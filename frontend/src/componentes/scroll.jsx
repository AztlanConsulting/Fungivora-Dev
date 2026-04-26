import React from "react";

const LayoutDividido = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA (Con Scroll) */}
      <div className="w-1/2 h-full overflow-y-auto bg-white p-8">
        <h2 className="text-2xl font-bold mb-4">Contenido con Scroll</h2>
        {/* Aquí meterías tus inputs, el stepper, etc. */}
        <div className="space-y-10">
          {[...Array(20)].map((_, i) => (
            <p key={i} className="text-gray-600">
              Este lado se mueve libremente. Es ideal para formularios largos 
              o listas de datos mientras mantienes una referencia visual a la derecha.
            </p>
          ))}
        </div>
      </div>

      {/* SECCIÓN DERECHA (Fija) */}
      <div className="w-1/2 h-full bg-[#F9FDFF] border-l flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-[#3b3fb6]">Panel Fijo</h2>
        <p className="text-gray-500 text-center">
          Este contenido siempre estará visible, no importa cuánto scroll 
          hagas en el lado izquierdo.
        </p>
        {/* Aquí podrías poner un resumen, una imagen o una tarjeta de estado */}
        <div className="mt-6 w-64 h-64 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
             <span className="text-sm text-gray-400 text-center px-4">
                Información de referencia, totales o una previsualización.
             </span>
        </div>
      </div>

    </div>
  );
};

export default LayoutDividido;
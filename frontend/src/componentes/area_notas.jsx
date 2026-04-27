import React from "react";

/**
 * TarjetaNota
 * Componente visual para la representación de entradas de notas.
 * Presenta la fecha y una parte del contenido.
 * @param fecha String que representa la fecha de la nota
 * @param preview Texto corto o pedazo de este de la nota para visualización rápida
 * @param onClick Callback opcional para manejar la selección de la tarjeta
 */
const TarjetaNota = ({ fecha, preview }) => {
  return (
    <div className="w-full max-w-full md:max-w-2xl bg-white rounded-[30px] shadow-lg p-8 border border-gray-100 flex flex-col gap-4 transition-transform hover:scale-[1.01]">
      {/* Para poder vizualizar la fecha*/}
      <div className="text-3xl md:text-4xl font-light text-gray-800 tracking-tight">
        {fecha}
      </div>

      <div className="w-full h-[1.5px] bg-gray-100 rounded-full"></div>

      <div className="mt-2">
        {/* Para vizualizar la cacho de texto*/}
        <p className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed italic break-words">
          {preview}
        </p>
      </div>
      
      {/* Área para el icono de imagen si es necesario */}
      <div className="h-4"></div>
    </div>
  );
};

export default TarjetaNota;
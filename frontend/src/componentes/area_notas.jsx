import React from "react";
import Text from "./texto";

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
      <Text 
        variante="popup" 
        as="div" 
        style={{ color: "#333", fontWeight: 400 }}
      >
        {fecha}
      </Text>

      <div className="w-full h-[1.8px] bg-gray-200 rounded-full"></div>

      <div className="mt-2">
        {/* Para vizualizar la cacho de texto*/}
        <Text 
          variante="body" 
          as="p" 
          style={{ 
            color: "#666", 
            lineHeight: "1.7" 
          }}
        >
          {preview}
        </Text>
      </div>
      
      {/* Área para el icono de imagen si es necesario */}
      <div className="h-4"></div>
    </div>
  );
};

export default TarjetaNota;
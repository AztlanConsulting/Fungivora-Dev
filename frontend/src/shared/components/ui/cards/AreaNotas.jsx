import React from "react";
import Text from "../basics/Texto";

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
    <div className="w-full h-auto min-h-full bg-white rounded-[30px] shadow-lg p-6 border border-gray-100 flex flex-col gap-3 transition-transform hover:scale-[1.01]">
      
      <div className="text-[16px] md:text-[20px]">
        <Text variante="popup" as="div" style={{ color: "#333", fontWeight: 600, fontSize: "inherit" }}>
          {fecha}
        </Text>
      </div>

      <div className="w-full h-[1.5px] bg-gray-100 rounded-full"></div>
      <div className="flex-1 text-[13px] md:text-[15px]">
        <Text
          variante="body"
          as="p"
          style={{
            color: "#666",
            lineHeight: "1.5",
            fontSize: "inherit"
          }}
        >
          {preview}
        </Text>
      </div>
    </div>
  );
};

export default TarjetaNota;
import React, { useState } from "react";
import { colores } from "../../basics/colores";
import Text from "../../basics/texto";

const EntradaCard = ({ nombre, unidad, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const ringColor = isFocused ? colores.azul : colores.grisClaro;

  const alturaStyle = {
    height: "clamp(28px, 3vw, 40px)",
    boxShadow: `0 0 0 ${isFocused ? "4px" : "2px"} ${ringColor}`,
    transition: "all 0.2s ease"
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4">
    
        <Text variante="label" style={{color: colores.black, fontSize: "18px"}}>
            {nombre}
        </Text>

        <div className="flex flex-row g-2 px-6 py-4">
            <div className="flex flex-row items-center px-3 rounded-xl bg-white" style={alturaStyle}>
                <input 
                type="text"
                inputMode="decimal"
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="outline-none w-16 text-center bg-transparent"
                />

            </div>
            
            <Text variante="label" style={{color: colores.black}}>
                {unidad}
            </Text>
        </div>
    </div>
  );
};

export const EntradaLista = ({ items = [] }) => {
  return (
    <div className={`w-full max-h-[780px] md:max-h-[700px] lg:flex-1 bg-white rounded-[32px] shadow-sm border p-4 md:p-8 lg:block`}>
        <Text variante="medium">Composición</Text>
        <div className={`flex flex-row flex-wrap justify-center`}>
            {items.map((item, index) => (
                <EntradaCard
                key={index}
                nombre={item.nombre}
                unidad={item.unidad}
                value={item.value}
                onChange={item.onChange}
                />
            ))}
        </div>
    </div>
  );
};
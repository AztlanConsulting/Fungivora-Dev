import React, { useState } from "react";
import { colores } from "../../../shared/components/ui/basics/colores";
import Text from "../../../shared/components/ui/basics/texto";
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

const EntradaCard = ({ nombre, unidad, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const ringColor = isFocused ? colores.azul : colores.grisClaro;

  const alturaStyle = {
    height: "clamp(28px, 3vw, 40px)",
    boxShadow: `0 0 0 ${isFocused ? "4px" : "2px"} ${ringColor}`,
    transition: "all 0.2s ease"
  };

  return (
    <div className="flex flex-col items-center gap-5 p-5">
    
        <Text className="p-2" variante="label" style={{color: colores.black, fontSize: "18px"}}>
            {nombre}
        </Text>

        <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center px-3 rounded-xl bg-white" style={alturaStyle}>
                <input 
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => {
                    const val = e.target.value;
                    const regex = /^\d*[.,]?\d{0,2}$/;
                    if (regex.test(val) || val === "") {onChange(e)}
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="outline-none w-16 text-center bg-transparent"
                />

            </div>
            
            <div className="">
                <Text variante="label" style={{color: colores.black}}>
                    {unidad}
                </Text>
            </div>
        </div>
    </div>
    
  );
};

export const EntradaLista = ({ items = [] }) => {
  return (
    <div className="w-full max-h-[780px] md:max-h-[700px] lg:flex-1 bg-white rounded-[32px] shadow-sm border p-6 md:p-8 flex flex-col">
      
      <div className="mb-6">
        <Text variante="medium">Composición</Text>
      </div>

      <div className="flex flex-col md:flex-row justify-evenly items-center flex-1 bg-[#FEFEFB] rounded-[32px] shadow-sm border overflow-hidden">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <EntradaCard
              nombre={item.nombre}
              unidad={item.unidad}
              value={item.value}
              onChange={item.onChange}
            />

            
            {index < items.length - 1 && (
                
                <div className="relative flex items-center justify-center self-stretch mx-4">
                    
                    {/* El Divisor Vertical */}
                    <div 
                    className="hidden md:block w-[1px] h-full" 
                    style={{ backgroundColor: colores.grisClaro }} 
                    />

                    {/* El Símbolo + */}
                    <div className="absolute md:flex items-center justify-center">
                    <Text variante="medium" style={{ color: colores.azul, lineHeight: 0, fontSize: "22px"}}>
                        +
                    </Text>
                    </div>

                    {/* Divisor Mobile (Opcional) */}
                    <div className="block md:hidden h-[1px] w-full" style={{ backgroundColor: colores.grisClaro }} />
                </div>
                )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
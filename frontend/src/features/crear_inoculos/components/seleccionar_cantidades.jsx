import React, { useState } from "react";
import { colores } from "../../../shared/components/ui/basics/colores";
import Text from "../../../shared/components/ui/basics/texto";
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

const EntradaCard = ({ nombre, unidad, value, onChange, cantMax }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [cantError, setError] = useState(false);
  
  const ringColor = isFocused ? colores.azul : colores.grisClaro;

  const alturaStyle = {
    height: "clamp(28px, 3vw, 40px)",
    boxShadow: `0 0 0 ${isFocused ? "4px" : "2px"} ${ringColor}`,
    transition: "all 0.2s ease",
    border: cantError ? `1px solid ${colores.rojo}` : "none"
  };

  const manejarCambio = (e) => {
    const val = e.target.value;
    const regex = /^\d*[.,]?\d{0,2}$/;

    if ( val === "" || regex.test(val)) {
      const numValor = parseFloat(val.replace(',', '.'));

      if (!isNaN(numValor)) {
        if (numValor > cantMax) {
          setError(true);
          e.target.value = cantMax.toString();
          onChange(e);

          setTimeout(() => setError(false), 5000)
        }
        else {
          setError(false)
          onChange(e);
        }
      }
      else {
        onChange(e);
      }
    }

  }

  return (
    <div className="relative flex flex-col items-center gap-3 p-5 ">
    
        <Text className="text-center p-2" variante="label" style={{color: colores.black, fontSize: "18px"}}>
            {nombre}
        </Text>

        <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row items-center  w-full mb-3 px-3 rounded-xl bg-white" style={alturaStyle}>
                <input 
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={value}
                onChange={manejarCambio}
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
        <div className={`relative md:absolute -bottom-1 mb-2 left-2 transition-opacity duration-300 ${cantError ? "opacity-100" : "opacity-0"}`}>
          <span style={{ color: "red", fontSize: "10px", fontWeight: "600" }}>
            Máximo disponible: {cantMax}
          </span>
        </div>
    </div>
    
  );
};

export const EntradaLista = ({ items = [] }) => {
  return (
    <div className="w-full lg:flex-1 bg-white rounded-[32px] shadow-sm border pb-8 p-6 md:p-8 flex flex-col">

      <div className="mb-6">
        <Text variante="medium">Composición</Text>
      </div>

      <div className="flex flex-col md:flex-row justify-evenly items-center flex-1 bg-[#FEFEFB] rounded-[32px] shadow-sm border overflow-hidden py-4 md:py-0">
        {items.map((item, index) => (
          <React.Fragment key={index}>

            {/* Card — centrada en mobile, normal en desktop */}
            <div className="w-full md:w-auto flex justify-center items-center">
              <EntradaCard
                nombre={item.nombre}
                unidad={item.unidad}
                value={item.value}
                onChange={item.onChange}
                cantMax={item.cantidad}
              />
            </div>

            {index < items.length - 1 && (
              <div className="flex items-center justify-center w-3/4 md:w-auto md:self-stretch mx-auto md:mx-4">

                {/* Línea vertical — solo desktop */}
                <div
                  className="hidden md:block w-[1px] h-full"
                  style={{ backgroundColor: colores.grisClaro }}
                />

                {/* + con líneas a los lados — solo mobile */}
                <div className="flex md:hidden items-center w-full gap-3">
                  <div className="flex-1 h-[1px]" style={{ backgroundColor: colores.grisClaro }} />
                  <Text variante="medium" style={{ color: colores.azul, fontSize: "22px", lineHeight: 1 }}>
                    +
                  </Text>
                  <div className="flex-1 h-[1px]" style={{ backgroundColor: colores.grisClaro }} />
                </div>

                {/* + solo — solo desktop (sobre la línea vertical) */}
                <div className="hidden md:flex absolute items-center justify-center">
                  <Text variante="medium" style={{ color: colores.azul, lineHeight: 0, fontSize: "22px" }}>
                    +
                  </Text>
                </div>

              </div>
            )}

          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
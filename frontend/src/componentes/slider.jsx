import React, { useState } from "react";
import { colores } from "./colores";

/**
 * Slider
 * Componente de selección numérica de 0 a 100
 * Utiliza un input range oculto para gestionar el progreso.
 * @param value Valor numérico actual 
 * @param onChange Callback que devuelve el nuevo valor seleccionado
 */
const Slider = ({ value, onChange }) => {
  const [val, setVal] = useState(value || 0);

  const totalSteps = 10; // Para que sea del 0 - 100
  const stepsArray = Array.from({ length: totalSteps + 1 }, (_, i) => i * 10);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setVal(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="w-full py-12 px-4">
      <div className="relative h-2 flex items-center">
        
        {/* Línea Base*/}
        <div 
          className="absolute w-full h-[3px] rounded-full"
          style={{ backgroundColor: colores.gris }}
        />

        {/* Línea de Progreso*/}
        <div 
          className="absolute h-[3px] rounded-full transition-all duration-150"
          style={{ 
            backgroundColor: colores.azul,
            width: `${val}%` 
          }}
        />

        {/* Marcas de líneas */}
        <div className="absolute w-full flex justify-between px-0">
          {stepsArray.map((step) => {
            const isReached = val >= step;
            return (
              <div key={step} className="relative flex flex-col items-center">
                <div 
                  className="w-[2px] h-4 mb-1"
                  style={{ 
                    backgroundColor: isReached ? colores.azul : colores.gris,
                    transition: "background-color 0.3s"
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Input Range*/}
        <input
          type="range"
          min="0"
          max="100"
          value={val}
          onChange={handleChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-30"
        />

        {/* Círculo que se mueve*/}
        <div 
          className="absolute z-20 pointer-events-none transition-all duration-150"
          style={{ 
            left: `calc(${val}% - 12px)`, // Centrado
          }}
        >
          <div 
            className="w-6 h-6 rounded-full border-2 shadow-sm"
            style={{ 
              backgroundColor: colores.azulOscuro,
              borderColor: colores.azul
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
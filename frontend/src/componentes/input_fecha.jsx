import React, { useState } from "react";
import { colores } from "./colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';

/**
 * Componente de entrada de fecha con campos de día, mes y año.
 * Se eliminó la duplicidad de texto utilizando placeholders nativos
 * para asegurar que el número y la etiqueta no se encimen.
 */
const InputFecha = ({ value = {}, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    /* Función para validar la entrada: solo números y rangos lógicos
    */
    const handleChange = (field, val) => {
        if (!/^\d*$/.test(val)) return; // Solo permite dígitos
        
        if (field === "day") {
            if (val.length > 2) return;
            if (parseInt(val) > 31) return;
        }
        if (field === "month") {
            if (val.length > 2) return;
            if (parseInt(val) > 12) return; 
        }
        if (field === "year") {
            if (val.length > 4) return; 
        }
        onChange({ ...value, [field]: val });
    };

    /**
     * Estilos base para los inputs:
     * text-center: asegura que el número y el placeholder estén centrados.
     * placeholder:text-gray-400: define el color del DD/MM/YYYY cuando no hay valor.
     */
    const inputStyle = `
        w-full h-full bg-transparent 
        text-center outline-none 
        text-[#3b3fb6] font-semibold text-lg
        placeholder:text-gray-400
        [appearance:textfield]
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
    `;

    const ringColor = isFocused ? colores.azul : colores.grisMedio;

    return (
        <div 
            className={`
                w-80 h-10 md:w-96 md:h-12
                bg-[#FFFFFF] rounded-md overflow-hidden transition-all flex items-stretch
                ${isFocused ? "ring-4" : "ring-2"} ring-[var(--input-ring)]
            `}
            style={{ "--input-ring": isFocused ? colores.azul : colores.grisClaro }}
        >
            
            {/* Icono lateral con borde divisorio */}
            <div 
                className="flex items-center justify-center px-3 border-r-2" 
                style={{ borderColor: colores.grisClaro, color: ringColor }}
            >
                <HugeiconsIcon icon={Calendar03Icon} size={26} />
            </div>

            {/* Contenedor principal de los inputs */}
            <div className="flex flex-1 items-center">
                
                {/* Campo Día */}
                <div className="flex-1 h-full">
                    <input
                        className={inputStyle}
                        placeholder="DD"
                        value={value.day || ""}
                        onChange={(e) => handleChange("day", e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        inputMode="numeric"
                    />
                </div>

                {/* Divisor Visual */}
                <div className="w-[2px] h-full" style={{ backgroundColor: colores.grisClaro }} />

                {/* Campo Mes */}
                <div className="flex-1 h-full">
                    <input
                        className={inputStyle}
                        placeholder="MM"
                        value={value.month || ""}
                        onChange={(e) => handleChange("month", e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        inputMode="numeric"
                    />
                </div>

                {/* Divisor Visual */}
                <div className="w-[2px] h-full" style={{ backgroundColor: colores.grisClaro}} />

                {/* Campo Año */}
                <div className="flex-[1.5] h-full">
                    <input
                        className={inputStyle}
                        placeholder="YYYY"
                        value={value.year || ""}
                        onChange={(e) => handleChange("year", e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        inputMode="numeric"
                    />
                </div>
            </div>
        </div>
    );
};

export default InputFecha;
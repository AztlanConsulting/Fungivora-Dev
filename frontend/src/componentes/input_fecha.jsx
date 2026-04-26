import React, { useState } from "react";
import { colores } from "./colores";
import Text from "./texto";
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';

/**
 * Componente de entrada de fecha con campos de día, mes y año.
 * Mantiene la consistencia visual con el componente Input, utilizando
 * el sistema de enfoque y validaciones de rango.
 * @param {Object} value - Objeto con las propiedades 
 * @param {Function} onChange - Callback que retorna el objeto de fecha actualizado
 */
const InputFecha = ({ value = {}, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    /* 
    Función para unicamente la aceptación de números
    Con rangos especificos para el día, mes y año
    Inpidiendo poner números de más para el campo
    */
    const handleChange = (field, val) => {
        if (!/^\d*$/.test(val)) return;
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

    const inputOverlay = `
        absolute inset-0 w-full h-full 
        bg-transparent text-center outline-none 
        text-transparent caret-[#3b3fb6]
        [appearance:textfield]
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
    `;

    return (
        <div 
            className={`
                w-80 h-10 md:w-96 md:h-12
                bg-[#F9FDFF] rounded-md overflow-hidden transition-all flex items-stretch
                ${isFocused ? "ring-4" : "ring-2"} ring-[var(--input-ring)]
            `}
            style={{ "--input-ring": isFocused ? colores.verde : colores.azul }}
        >
            {/* Icono */}
            <div 
                className="flex items-center justify-center px-3 border-r-2" 
                style={{ borderColor: colores.azul, color: colores.azul }}
            >
                <HugeiconsIcon icon={Calendar03Icon} size={26} />
            </div>

            {/* Contenedor flexible */}
            <div className="flex flex-1 items-center">
                
                {/* Día */}
                <div className="relative flex-1 h-full flex items-center justify-center">
                    <Text variante="dates">
                        {value.day || "DD"}
                    </Text>
                    <input
                        className={inputOverlay}
                        value={value.day || ""}
                        onChange={(e) => handleChange("day", e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        inputMode="numeric"
                    />
                </div>

                {/* Divisor */}
                <div className="w-[2px] self-stretch" style={{ backgroundColor: colores.azul }} />

                {/* Mes */}
                <div className="relative flex-1 h-full flex items-center justify-center">
                    <Text variante="dates">
                        {value.month || "MM"}
                    </Text>
                    <input
                        className={inputOverlay}
                        value={value.month || ""}
                        onChange={(e) => handleChange("month", e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        inputMode="numeric"
                    />
                </div>

                {/* Divisor */}
                <div className="w-[2px] self-stretch" style={{ backgroundColor: colores.azul }} />

                {/* Año */}
                <div className="relative flex-[1.5] h-full flex items-center justify-center">
                    <Text variante="dates">
                        {value.year || "YYYY"}
                    </Text>
                    <input
                        className={inputOverlay}
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
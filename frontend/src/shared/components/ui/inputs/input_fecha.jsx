import React, { useState } from "react";
import { colores } from "../basics/colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';

const hoyInicial = () => {
    const hoy = new Date();
    return {
        day:   String(hoy.getDate()).padStart(2, "0"),
        month: String(hoy.getMonth() + 1).padStart(2, "0"),
        year:  String(hoy.getFullYear()),
    };
};

const esFechaValida = ({ day, month, year }) => {
    if (!day || !month || !year || String(year).length < 4) return false;
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    if (y < 2020 || y > 2100) return false; 
    const fecha = new Date(y, m - 1, d);
    return (
        fecha.getFullYear() === y &&
        fecha.getMonth()    === m - 1 &&
        fecha.getDate()     === d
    );
};

const InputFecha = ({ value = {}, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (field, val) => {
        if (!/^\d*$/.test(val)) return;

        if (field === "day") {
            if (val.length > 2) return;
            if (val.length === 2 && parseInt(val) > 31) return;
            if (parseInt(val) === 0 && val.length === 2) return;
        }
        if (field === "month") {
            if (val.length > 2) return;
            if (val.length === 2 && parseInt(val) > 12) return;
            if (parseInt(val) === 0 && val.length === 2) return;
        }
        if (field === "year") {
            if (val.length > 4) return;
        }

        onChange({ ...value, [field]: val });
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!esFechaValida(value)) {
            onChange(hoyInicial());
        }
    };

    const inputStyle = `
        w-full h-full bg-transparent 
        text-center outline-none 
        text-[#555555] font-semibold text-lg
        placeholder:#BFC1C7
        [appearance:textfield]
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
    `;

    return (
        <div
            className={`
                w-80 h-10 md:w-96 md:h-12
                bg-[#FFFFFF] rounded-md overflow-hidden transition-all flex items-stretch
                ${isFocused ? "ring-4" : "ring-2"}
            `}
            style={{ outline: "none", boxShadow: `0 0 0 ${isFocused ? "4px" : "2px"} ${isFocused ? colores.azul : colores.grisClaro}` }}
        >
            {/* Icono lateral */}
            <div
                className="flex items-center justify-center px-3 border-r-2"
                style={{ borderColor: colores.grisClaro, color: isFocused ? colores.azul : colores.grisMedio }}
            >
                <HugeiconsIcon icon={Calendar03Icon} size={26} />
            </div>

            {/* Inputs */}
            <div className="flex flex-1 items-center">

                <div className="flex-1 h-full">
                    <input
                        className={inputStyle}
                        placeholder="DD"
                        value={value.day || ""}
                        onChange={(e) => handleChange("day", e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                        inputMode="numeric"
                    />
                </div>

                <div className="w-[2px] h-full" style={{ backgroundColor: colores.grisClaro }} />

                <div className="flex-1 h-full">
                    <input
                        className={inputStyle}
                        placeholder="MM"
                        value={value.month || ""}
                        onChange={(e) => handleChange("month", e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                        inputMode="numeric"
                    />
                </div>

                <div className="w-[2px] h-full" style={{ backgroundColor: colores.grisClaro }} />

                <div className="flex-[1.5] h-full">
                    <input
                        className={inputStyle}
                        placeholder="YYYY"
                        value={value.year || ""}
                        onChange={(e) => handleChange("year", e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                        inputMode="numeric"
                    />
                </div>

            </div>
        </div>
    );
};

export default InputFecha;
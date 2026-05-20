import React, { useState } from "react";
import { colores } from "../basics/colores";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

const SelectField = ({
  value,
  onChange,
  placeholder,
  options = [],
  size = "normal",
  loading = false,
  error = null,
  label = null,
  disabled = false,
}) => {
  // Estado para controlar el foco y el ring
  const [isFocused, setIsFocused] = useState(false);

  const sizes = {
    forms: "w-80 md:w-[24rem]",
    normal: "w-80 md:w-96",
    amplio: "w-80 md:w-96",
    numero: "w-28 md:w-36",
  };

  const textColor = colores.gris;
  const sizeClass = sizes[size] || sizes.normal;

  // Clases base del select
  const selectClase = `
    w-full
    px-3 py-2 pr-10
    text-base
    outline-none cursor-pointer appearance-none
    bg-transparent
    transition-colors
  `;

  const placeholderText = loading
    ? "Cargando..."
    : error
      ? error
      : placeholder;

  const isDisabled = disabled || loading;

  return (
    <div className="flex flex-col gap-2">
      {/* Título opcional */}
      {label && (
        <span style={{ fontSize: "28px", color: colores.negro, fontWeight: "500", fontStyle: "italic" }}>
          {label}
        </span>
      )}

      <div 
        className={`
          relative overflow-hidden rounded-xl transition-all
          ${sizeClass}
          ${isFocused ? "ring-4" : "ring-2"}
        `}
        style={{ 
          backgroundColor: "#FFFFFF",
          ringColor: isFocused ? colores.azul : colores.grisClaro,
          boxShadow: `0 0 0 ${isFocused ? '4px' : '2px'} ${isFocused ? colores.azul : colores.grisClaro}`
        }}
      >
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={selectClase}
          style={{
            color: textColor,
            fontStyle: "italic",
            border: "none"
          }}
          disabled={isDisabled}
        >
          <option value="" disabled hidden>
            {placeholderText}
          </option>

          {options.map((op, index) => (
            <option key={`${op.value}-${index}`} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        {/* Icono de flecha */}
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: colores.grisMedio }}
        >
          <HugeiconsIcon icon={ArrowDown01Icon} size={20} />
        </span>
      </div>
    </div>
  );
};

export default SelectField;
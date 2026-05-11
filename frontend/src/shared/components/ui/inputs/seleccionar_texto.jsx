// frontend/src/shared/components/ui/inputs/seleccionar_texto.jsx
import React from "react";
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
  const sizes = {
    forms: "w-80 md:w-[24rem]",
    normal: "w-80 md:w-96",
    amplio: "w-80 md:w-96",
    numero: "w-28 md:w-36",
  };

  const textColor = colores.gris;

  const clase = `${sizes[size]}
    border-2
    rounded-xl
    px-3 py-2 pr-8
    text-base
    outline-none cursor-pointer appearance-none
    transition-colors focus:border-[#3b3fb6]`;

  const placeholderText = loading
    ? "Cargando..."
    : error
      ? error
      : placeholder;

  // disabled es true si se recibe por prop O si está cargando
  const isDisabled = disabled || loading;

  return (
    <div className="flex flex-col gap-2">
      {/* Título opcional */}
      {label && (
        <span style={{ fontSize: "28px", color: colores.negro, fontWeight: "500", fontStyle: "italic" }}>
          {label}
        </span>
      )}

      <div className="relative w-fit">
        <select
          value={value}
          onChange={onChange}
          className={clase}
          style={{
            backgroundColor: "#FFFFFF",
            color: textColor,
            borderColor: colores.grisClaro,
            fontStyle: "italic",
          }}
          disabled={isDisabled}
        >
          <option value="" disabled hidden>
            {placeholderText}
          </option>

          {/* Se usa index en el key para evitar warnings con valores duplicados */}
          {options.map((op, index) => (
            <option key={`${op.value}-${index}`} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        <span
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
          style={{ color: colores.grisMedio }}
        >
          <HugeiconsIcon icon={ArrowDown01Icon} size={24} />
        </span>
      </div>
    </div>
  );
};

export default SelectField;
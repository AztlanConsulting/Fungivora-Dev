import React, { useState } from "react";
import { colores } from "../basics/Colores";

/**
 * Campo numérico de enteros con botones de incremento y decremento.
 * Se ocultan las flechas nativas del browser para que solo funcionen los botones −/+ del componente.
 */
const InputCantidad = ({ value, onChange, min = 1, max = 15 }) => {
  const [isFocused, setIsFocused] = useState(false);

  const incrementar = () =>
    onChange(Math.min(Number(value || 0) + 1, max));

  const decrementar = () =>
    onChange(Math.max(Number(value || 0) - 1, min));

  const manejarCambio = (e) => {
    const raw = e.target.value;

    if (!/^\d*$/.test(raw)) return;
    if (raw === "") { onChange(""); return; }

    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= min && num <= max) onChange(num);
  };

  const prevenirCaracteresEspeciales = (e) => {
  if (["-", "+", ".", "e", ","].includes(e.key)) {
    e.preventDefault();
  }
};

  const estiloMedium = {
    fontSize: "clamp(12px, 4vw, 22px)",
    fontWeight: 500,
  };

  return (
    <div
      className="flex items-stretch rounded-xl overflow-hidden bg-white"
      style={{
        border: `2px solid ${isFocused ? colores.azul : colores.grisClaro}`,
        transition: "border-color 0.2s ease",
      }}
    >
      <button
        type="button"
        onClick={decrementar}
        className="px-4 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors select-none"
        style={{
          ...estiloMedium,
          color: colores.azul,
          borderRight: `1px solid ${colores.grisClaro}`,
        }}
      >
        −
      </button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={manejarCambio}
        onKeyDown={prevenirCaracteresEspeciales}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="
          w-16 text-center outline-none bg-transparent
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
        "
        style={{
          ...estiloMedium,
          color: colores.negro,
        }}
      />

      <button
        type="button"
        onClick={incrementar}
        className="px-4 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors select-none"
        style={{
          ...estiloMedium,
          color: colores.azul,
          borderLeft: `1px solid ${colores.grisClaro}`,
        }}
      >
        +
      </button>
    </div>
  );
};

export default InputCantidad;
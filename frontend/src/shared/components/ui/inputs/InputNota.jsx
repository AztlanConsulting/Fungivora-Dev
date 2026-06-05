import React, { useState } from "react";
import { colores } from "../basics/Colores";

/**
 * Textarea para notas libres.
 *
 * El componente recibe y devuelve un string plano (value / onChange),
 * lo que lo hace fácil de conectar con useState en el form padre.
 */
const InputNota = ({
  value,
  onChange,
  placeholder = "Escribe tu nota...",
  rows = 7,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="w-full rounded-xl px-4 py-3 outline-none resize-none"
      style={{
        fontSize: "clamp(12px, 1.5vw, 14px)",
        color: colores.gris,
        backgroundColor: "#FFFFFF",
        border: `2px solid ${isFocused ? colores.azul : colores.grisClaro}`,
        transition: "border-color 0.2s ease",
      }}
      maxLength={250}
    />
  );
};

export default InputNota;
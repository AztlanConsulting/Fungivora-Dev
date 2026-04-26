import React, { useState } from "react";
import { colores } from "./colores";
import Text from "./texto";

const EntradaCantidad = ({
  nombre = "",
  unidad = "ml",
  value,
  onChange,
  numeroTipo = "decimal",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const ringColor = isFocused ? colores.verde : colores.azul;

  
  const alturaStyle = {
    height: "clamp(28px, 3vw, 40px)",
    boxShadow: `0 0 0 ${isFocused ? "4px" : "2px"} ${ringColor}`,
  };

  const textoStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "clamp(14px, 1.2vw, 18px)",
    lineHeight: 1,
  };

  return (
    <div
      className="flex items-stretch w-full rounded-full overflow-hidden transition-all bg-white"
      style={alturaStyle}
    >
      {/* Nombre del ingrediente */}
      <div className="flex flex-1 items-center px-5 bg-transparent">
        <p style={{ ...textoStyle, fontWeight: 700, color: colores.azul, margin: 0 }}>
          {nombre}
        </p>
      </div>

      {/* Divisor vertical */}
      <div style={{ width: "3px", backgroundColor: ringColor }} />

      {/* Input numérico */}
      <div
        className="flex items-center justify-center bg-transparent"
        style={{ width: "80px" }}
      >
        <input
          type="text"
          inputMode={numeroTipo === "decimal" ? "decimal" : "numeric"} //  Solo afecta en Móvil,
          pattern={numeroTipo === "decimal" ? "[0-9]*[.,]?[0-9]{0,2}" : "[0-9]*"} // Usado para validar la entrada que se recibe
          value={value}
          //Verifica que la entrada a recibir sea un numero, solo permite numeros con 2 decimales
          onChange={(e) => {
            const regex = numeroTipo === "decimal" ? /^\d*[.,]?\d{0,2}$/ : /^\d*$/;
            if (regex.test(e.target.value)) onChange(e);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            w-full text-center bg-transparent outline-none
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          "
          style={{ ...textoStyle, color: "#868889" }}
        />
      </div>

      {/* Pastilla de unidad */}
      <div
        className="flex items-center justify-center rounded-r-full"
        style={{ backgroundColor: "#C5C7F0", width: "56px" }}
      >
        <p style={{ ...textoStyle, fontWeight: 700, color: colores.azul, margin: 0 }}>
          {unidad}
        </p>
      </div>
    </div>
  );
};

/**
 * EntradaCantidadLista
 * Recibe una lista de objetos (nombre, unidad, value, onChange, numeroTipo )
 * Por cada lista recibida, los agrupa de forma ordenada dentro de la caja principal
 */
export const EntradaCantidadLista = ({ items = [] }) => {
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-3xl w-80 md:w-96"
      style={{ border: `3px solid ${colores.azul}`, backgroundColor: '#C5CAE9' }}
    >
      {items.map((item, index) => (
        <EntradaCantidad
          key={index}
          nombre={item.nombre}
          unidad={item.unidad}
          value={item.value}
          onChange={item.onChange}
          numeroTipo={item.numeroTipo}
        />
      ))}
    </div>
  );
};

export default EntradaCantidad;

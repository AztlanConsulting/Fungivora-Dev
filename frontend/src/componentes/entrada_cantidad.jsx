import React, { useState } from "react";
import { colores } from "./colores";

/**
 * EntradaCantidad
 * Fila individual que representa un ingrediente con su cantidad y unidad.
 * Se compone de tres secciones: nombre | input numérico | pastilla de unidad.
 *
 * El borde cambia de azul a verde al enfocar, igual que el resto de inputs del sistema.
 */
const EntradaCantidad = ({
  nombre = "",
  unidad = "ml",
  value,
  onChange,
  placeholder = "0",
  numeroTipo = "decimal",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Azul en reposo, verde al enfocar — consistente con el sistema de diseño
  const ringColor = isFocused ? colores.verde : colores.azul;

  // La altura escala fluidamente entre pantallas usando clamp.
  // El boxShadow simula el ring de foco para poder cambiar su color dinámicamente
  const alturaStyle = {
    height: "clamp(28px, 3vw, 40px)",
    boxShadow: `0 0 0 ${isFocused ? "4px" : "2px"} ${ringColor}`,
  };

  // Tipografía compartida entre el nombre, el input y la unidad
  const textoStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "clamp(11px, 1.2vw, 18px)",
    lineHeight: 1,
  };

  return (
    // items-stretch hace que las tres secciones tengan la misma altura.
    // bg-white es el fondo de la fila; las secciones internas son transparentes para heredarlo
    <div
      className="flex items-stretch w-full rounded-full overflow-hidden transition-all bg-white"
      style={alturaStyle}
    >
      {/* Sección izquierda: nombre del ingrediente. flex-1 ocupa todo el espacio sobrante.
          min-w-0 permite que el texto se encoja correctamente dentro del flex */}
      <div className="flex flex-1 items-center px-5 bg-transparent min-w-0">
        <p style={{ ...textoStyle, fontWeight: 700, color: colores.azul, margin: 0 }}>
          {nombre}
        </p>
      </div>

      {/* Primer divisor vertical: separa el label del número */}
      <div style={{ width: "3px", backgroundColor: ringColor }} />

      {/* Sección central: input numérico con ancho fijo para que el divisor
          quede alineado en todas las filas independientemente del contenido */}
      <div
        className="flex items-center justify-center bg-transparent"
        style={{ width: "80px" }}
      >
        <input
          type="text"
          // inputMode activa el teclado correcto en móvil sin afectar desktop
          inputMode={numeroTipo === "decimal" ? "decimal" : "numeric"}
          // pattern es una pista secundaria para el navegador; la validación real ocurre en onChange
          pattern={numeroTipo === "decimal" ? "[0-9]*[.,]?[0-9]{0,2}" : "[0-9]*"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            // Valida el valor completo antes de propagarlo al estado.
            // decimal: permite dígitos, una coma/punto opcional y hasta 2 decimales
            // entero: solo dígitos, sin separadores
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
          // outline-none quita el foco nativo del navegador; el foco visual lo maneja
          // el contenedor padre con boxShadow.
          // Las clases webkit eliminan las flechitas nativas en Chrome y Safari
          style={{ ...textoStyle, color: "#868889" }}
        />
      </div>
      
      <div style={{ width: "3px", backgroundColor: ringColor }} />

      {/* Sección derecha: pastilla con la unidad de medida.
          rounded-r-full redondea solo la esquina derecha */}
      <div
        className="flex items-center justify-center"
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
 * Contenedor que agrupa varias entradas dentro de una caja con borde azul.
 * El gap entre filas deja ver el fondo del contenedor como separador visual.
 *
 * @param {Array} items - Lista de objetos con las props de cada EntradaCantidad:
 * { nombre, unidad, value, onChange, placeholder?, numeroTipo? }
 */
export const EntradaCantidadLista = ({ items = [] }) => {
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-3xl w-80 md:w-96"
      style={{ border: `3px solid ${colores.azul}`, backgroundColor: '#F9FDFF' }}
    >
      {/* Por cada item del array se renderiza una fila EntradaCantidad */}
      {items.map((item, index) => (
        <EntradaCantidad
          key={index}
          nombre={item.nombre}
          unidad={item.unidad}
          value={item.value}
          onChange={item.onChange}
          placeholder={item.placeholder}
          numeroTipo={item.numeroTipo}
        />
      ))}
    </div>
  );
};

export default EntradaCantidad;
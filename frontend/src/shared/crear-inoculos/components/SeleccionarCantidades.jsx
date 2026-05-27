import React, { useState, useRef, useEffect } from "react";
import { colores } from "../../components/ui/basics/Colores";
import Text from "../../components/ui/basics/Texto";
import Input from "../../components/ui/inputs/InputTexto";

const EntradaCard = ({
  nombre,
  unidad,
  value,
  onChange,
  cantMax = 0,
  excede = false,
  mensajeError = null,
  deshabilitado = false,
}) => {
  const [errorLocal, setErrorLocal] = useState(false);

  const manejarCambio = (e) => {
    if (deshabilitado) return;
    const val = e.target.value;
    const rawValue = val.replace(/,/g, "");

    if (rawValue !== "" && !/^\d*[.]?\d{0,2}$/.test(rawValue)) return;
    const numValor = parseFloat(rawValue);
    const cap = Number(cantMax) || 0;

    if (!isNaN(numValor) && cap > 0 && numValor > cap) {
      setErrorLocal(true);
      onChange({ target: { value: cap.toFixed(2).replace(/\.00$/, "") } });
      setTimeout(() => setErrorLocal(false), 5000);
      return;
    }

    const limpio = val.replace(/^0+(?=\d)/, "");
    onChange({ target: { value: limpio } });
  };

  const mostrarError = excede || errorLocal;
  const mensaje = errorLocal
    ? `Disponible: ${(Number(cantMax) || 0).toFixed(2).replace(/\.00$/, "")}`
    : mensajeError;

  return (
    <div
      className={`relative flex flex-col items-center gap-2 p-4 text-center ${deshabilitado ? "opacity-50" : ""
        }`}
      style={{ minWidth: 0 }}
    >
      {/* Título con altura mínima para alinear inputs en el eje Y */}
      <div className="flex items-center justify-center min-h-[50px] w-full">
        <Text
          className="break-words max-w-full line-clamp-2"
          variante="label"
          style={{ color: colores.black, fontSize: "16px" }}
        >
          {nombre}
        </Text>
      </div>

      {/* Input + Unidad */}
      <div className="flex flex-col items-center w-full gap-1">
        <div className="flex flex-row items-center gap-2 justify-center w-full">
          <div className="flex items-center rounded-xl px-2">
            <Input
              variante="numero"
              numeroTipo="decimal"
              placeholder="0"
              value={value}
              onChange={manejarCambio}
              roundedClass="rounded-xl"
              className="w-16 h-10 text-center"
              disabled={deshabilitado}
            />
          </div>
          <Text
            className="shrink-0"
            variante="label"
            style={{ color: colores.black, fontSize: "14px" }}
          >
            {unidad}
          </Text>
        </div>

        {/* Mensaje de error */}
        <div
          className={`h-4 transition-opacity duration-300 ${mostrarError ? "opacity-100" : "opacity-0"
            }`}
        >
          <span
            className="block text-center whitespace-nowrap"
            style={{ color: "red", fontSize: "11px", fontWeight: 600 }}
          >
            {mensaje || ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export const EntradaLista = ({ items = [] }) => {
  const containerRef = useRef(null);
  // true = todos en una sola fila → mostrar separadores "+"
  const [filaUnica, setFilaUnica] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calcular = () => {
      // Obtenemos solo los hijos que son cards (no los separadores)
      const cards = Array.from(container.querySelectorAll("[data-card]"));
      if (cards.length === 0) return;
      // Si todos tienen el mismo offsetTop, están en la misma fila
      const primerTop = cards[0].getBoundingClientRect().top;
      const todosMismaFila = cards.every(
        (c) => Math.abs(c.getBoundingClientRect().top - primerTop) < 4
      );
      setFilaUnica(todosMismaFila);
    };

    calcular();
    const ro = new ResizeObserver(calcular);
    ro.observe(container);
    return () => ro.disconnect();
  }, [items.length]);

  return (
    <div className="w-full lg:flex-1 bg-white rounded-[32px] shadow-sm border p-4 sm:p-6 md:p-8 flex flex-col">
      <div className="mb-6">
        <Text variante="medium">Composición Unitaria</Text>
      </div>

      {/*
        LAYOUT STRATEGY — sin breakpoints fijos:
        Siempre flex-row flex-wrap. Cada card tiene minWidth="130px".
        Si el contenedor es suficientemente ancho → fila única automática.
        Si no → los items que no caben bajan solos.
        ResizeObserver detecta si están todos en la misma fila para mostrar "+"
      */}
      <div
        ref={containerRef}
        className="bg-[#FEFEFB] rounded-[32px] shadow-sm border p-2 flex flex-row flex-wrap items-stretch"
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div
              data-card
              className="flex-1"
              style={{ minWidth: "130px" }}
            >
              <EntradaCard
                nombre={item.nombre}
                unidad={item.unidad}
                value={item.value}
                onChange={item.onChange}
                cantMax={item.cantidad}
                excede={item.excedeIndividual}
                mensajeError={item.mensajeErrorIndividual}
                deshabilitado={
                  item.tipo === "inoculo" && !(Number(item.cantidad) > 0)
                }
              />
            </div>

            {/* Separador "+" — solo visible cuando todos están en la misma fila */}
            {index < items.length - 1 && (
              <div
                className={`relative flex items-center justify-center self-stretch transition-opacity duration-200 ${filaUnica ? "opacity-100" : "opacity-0 pointer-events-none w-0 overflow-hidden"
                  }`}
              >
                <div
                  className="w-[1px] h-1/2 self-center"
                  style={{ backgroundColor: colores.grisClaro }}
                />
                <div
                  className="absolute flex items-center justify-center w-6 h-6 rounded-full"
                  style={{ backgroundColor: "#FEFEFB" }}
                >
                  <Text
                    variante="medium"
                    style={{
                      color: colores.azul,
                      fontSize: "20px",
                      transform: "translateY(-2px)",
                    }}
                  >
                    +
                  </Text>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
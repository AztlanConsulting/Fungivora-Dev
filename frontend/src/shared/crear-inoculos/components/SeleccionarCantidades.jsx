import React, { useState } from "react";
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
}) => {
  // Error efímero (se enciende cuando el usuario tipea > cantMax y se autocompleta al cap).
  const [errorLocal, setErrorLocal] = useState(false);

  const manejarCambio = (e) => {
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
    ? `Máximo disponible: ${(Number(cantMax) || 0).toFixed(2).replace(/\.00$/, "")} ${unidad}`
    : mensajeError;

  return (
    <div className="relative flex flex-col items-center gap-3 p-5 w-full md:w-auto min-w-0">

      <Text className="text-center p-2 break-all max-w-full" variante="label" style={{ color: colores.black, fontSize: "18px" }}>
        {nombre}
      </Text>

      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center w-full mb-3 px-3 rounded-xl bg-white">
          <Input
            variante="numero"
            numeroTipo="decimal"
            placeholder="0"
            value={value}
            onChange={manejarCambio}
            roundedClass="rounded-xl"
            className="w-16 h-12"
          />
        </div>

        <div>
          <Text variante="label" style={{ color: colores.black }}>
            {unidad}
          </Text>
        </div>
      </div>

      <div
        className={`relative md:absolute -bottom-1 mb-2 left-2 transition-opacity duration-300 ${
          mostrarError ? "opacity-100" : "opacity-0"
        }`}
      >
        <span style={{ color: "red", fontSize: "10px", fontWeight: 600 }}>
          {mensaje || ""}
        </span>
      </div>
    </div>
  );
};

export const EntradaLista = ({ items = [] }) => {
  return (
    <div className="w-full lg:flex-1 bg-white rounded-[32px] shadow-sm border pb-8 p-6 md:p-8 flex flex-col">

      <div className="mb-6">
        <Text variante="medium">Composición Unitaria</Text>
      </div>

      <div className="flex flex-col md:flex-row justify-evenly items-center flex-1 bg-[#FEFEFB] rounded-[32px] shadow-sm border overflow-hidden">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <EntradaCard
              nombre={item.nombre}
              unidad={item.unidad}
              value={item.value}
              onChange={item.onChange}
              cantMax={item.cantidad}
              excede={item.excedeIndividual}
              mensajeError={item.mensajeErrorIndividual}
            />

            {index < items.length - 1 && (
              <div className="relative flex items-center justify-center self-stretch w-full md:w-auto py-3 md:py-0 md:mx-4">
                <div
                  className="w-full h-[1px] md:w-[1px] md:h-full"
                  style={{ backgroundColor: colores.grisClaro }}
                />
                <div
                  className="absolute flex items-center justify-center px-3"
                  style={{ backgroundColor: "#FEFEFB" }}
                >
                  <Text variante="medium" style={{ color: colores.azul, lineHeight: 0, fontSize: "22px" }}>
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

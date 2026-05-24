import React, { useState } from "react";
import { colores } from "../../components/ui/basics/Colores";
import Text from "../../components/ui/basics/Texto";
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import  Input  from "../../components/ui/inputs/InputTexto";

const EntradaCard = ({ nombre, unidad, value, onChange, cantMax, repeticiones = 1 }) => {
  const [cantError, setError] = useState(false);

  const maxPorUnidad = cantMax > 0 ? +(cantMax / repeticiones).toFixed(2) : 0;

  const manejarCambio = (e) => {
    let val = e.target.value;
    const regex = /^\d*$/;

    if (val === "" || regex.test(val)) {
      // Quitar ceros a la izquierda (preserva "0", "0.5" y "0,5")
      val = val.replace(/^0+(?=\d)/, "");
      e.target.value = val;

      const numValor = parseInt(val, 10);

      if (!isNaN(numValor)) {
        if (numValor > maxPorUnidad) {
          setError(true);
          e.target.value = maxPorUnidad.toString();
          onChange(e);
          setTimeout(() => setError(false), 5000)
        }
        else {
          setError(false)
          onChange(e);
        }
      }
      else {
        onChange(e);
      }
    }

  }

  return (
    <div className="relative flex flex-col items-center gap-3 p-5 w-full md:w-auto min-w-0">

      <Text className="text-center p-2 break-all max-w-full" variante="label" style={{ color: colores.black, fontSize: "18px" }}>
        {nombre}
      </Text>

      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center  w-full mb-3 px-3 rounded-xl bg-white" >
          <Input
            variante="numero"
            numeroTipo="entero"
            placeholder="0"
            value={value}
            onChange={manejarCambio}
            roundedClass="rounded-xl"
            className="w-16 h-12"
          />

        </div>

        <div className="">
          <Text variante="label" style={{ color: colores.black }}>
            {unidad}
          </Text>
        </div>
      </div>
      <div className={`relative md:absolute -bottom-1 mb-2 left-2 transition-opacity duration-300 ${cantError ? "opacity-100" : "opacity-0"}`}>
        <span style={{ color: "red", fontSize: "10px", fontWeight: "600" }}>
          Máximo disponible: {maxPorUnidad}
        </span>
      </div>
    </div>

  );
};

export const EntradaLista = ({ items = [], repeticiones = 1 }) => {
  return (
    <div className="w-full lg:flex-1 bg-white rounded-[32px] shadow-sm border pb-8 p-6 md:p-8 flex flex-col">

      <div className="mb-6">
        <Text variante="medium">Composición</Text>
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
              repeticiones={repeticiones}
            />


            {index < items.length - 1 && (
              <div className="relative flex items-center justify-center self-stretch w-full md:w-auto py-3 md:py-0 md:mx-4">

                {/* Línea: horizontal en mobile, vertical en desktop */}
                <div
                  className="w-full h-[1px] md:w-[1px] md:h-full"
                  style={{ backgroundColor: colores.grisClaro }}
                />

                {/* Icono + centrado sobre la línea, con bg que la "corta" */}
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
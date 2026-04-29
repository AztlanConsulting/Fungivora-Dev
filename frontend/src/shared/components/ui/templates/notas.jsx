import React, { useState } from "react";
import Base from "../../layout/base";
import Titulo from "../basics/titulo";
import Button from "../buttons/botones";
import Input from "../inputs/input_texto";
import Text from "../basics/texto";
import InputFecha from "../inputs/input_fecha";
import TarjetaNota from "../cards/area_notas"
import { colores } from "../basics/colores";

function Notas() {
  const [val6, setVal6] = useState("");
  const [fecha, setFecha] = useState({ day: "", month: "", year: "" });
  const [verHistorial, setVerHistorial] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/*Notas a la izquierda*/}
      <div
        className={`flex-col w-full md:w-1/2 h-full border-r-2 border-gray-200 
        ${verHistorial ? "flex" : "hidden"} md:flex relative`}
      >
        <Titulo>Notas...</Titulo>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-12 py-6">
          <Base margen_arriba="mt-16 md:mt-20">
            <div className="flex flex-col gap-4">

              {/* Área para que en movil funcione con un botón */}
              <div className="md:hidden w-full px-2 mt-6">
                <div className="flex items-start">
                  <div
                    onClick={() => setVerHistorial(!verHistorial)} // Al darle al botón se ve el historial (notas)
                    className={`
                        px-4 h-8 rounded-md transition-all cursor-pointer
                        flex items-center justify-center
                        ${verHistorial ? "ring-4" : "ring-2"}
                        ring-[var(--input-ring)]
                    `}
                    style={{
                      "--input-ring": verHistorial ? colores.verde : colores.azul,
                      backgroundColor: "#F9FDFF"
                    }}
                  >
                    <Text variante="label">
                      Notas
                    </Text>
                  </div>
                </div>
              </div>

              {/* Ejemplo de como son las notas vizualmente 
                 (se elimina a futuro para añadirlas dinamicamente) */}
              <div className="flex flex-col gap-8 items-center w-full">
                <TarjetaNota
                  fecha="08 - 04 - 2026"
                  preview="Esta es mi primera nota... 
                        안녕, 내 이름은 freak (whoa, whoa)
                        네 꿈에 나타나 break your head
                        마지막인 듯 let's cry (whoa, whoa)
                        One look, I'm hooked (괜찮아요?)"
                />
                <TarjetaNota
                  fecha="09 - 04 - 2026"
                  preview="And my heart goes beep, beep, beep, beep, beep, beep
                        And my heart goes beep, beep, beep, beep, beep, beep
                        And my heart goes beep, beep, beep, beep, beep, beep
                        And my heart goes beep, beep, beep, beep, beep, beep
                        And my heart goes."
                />
                <TarjetaNota
                  fecha="07 - 04 - 2026"
                  preview="안녕, 내 이름은 freak (and my heart goes beep)
                        안녕, 내 이름은 freak (and my heart goes beep)
                        안녕, 내 이름은 freak"
                />
              </div>
            </div>
          </Base>
        </div>
      </div>

      {/* Área para poder introducir texto */}
      <div
        className={`w-full md:w-1/2 h-full bg-white relative
        ${verHistorial ? "hidden" : "flex"} md:flex flex-col`}
      >
        {/* Título fijo en la parte superior */}
        <div className="sticky top-0 left-0 w-full z-10 shrink-0">
          <Titulo color="white">Notas...</Titulo>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 md:px-12 flex flex-col">

          <div className="w-full max-w-sm mx-auto flex flex-col gap-6 px-4 md:px-0 mt-24 md:mt-40">

            {/* Switch para móvil */}
            <div className="md:hidden w-full mt-8">
              <div className="flex items-start">
                <div
                  onClick={() => setVerHistorial(!verHistorial)}
                  className={`px-4 h-8 rounded-md transition-all cursor-pointer flex items-center justify-center ${verHistorial ? "ring-4" : "ring-2"} ring-[var(--input-ring)]`}
                  style={{
                    "--input-ring": verHistorial ? colores.verde : colores.azul,
                    backgroundColor: "#F9FDFF"
                  }}
                >
                  <Text variante="label">Notas</Text>
                </div>
              </div>
            </div>

            <Text variante="medium" className="text-2xl font-bold text-gray-800">
              Nueva entrada
            </Text>

            <div className="flex flex-col gap-4">
              <InputFecha value={fecha} onChange={setFecha} />
              <Input
                variante="amplio"
                placeholder="Escribe tu entrada larga..."
                value={val6}
                onChange={(e) => setVal6(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-h-[10px]" />

          <div className="mt-auto w-full flex justify-center pt-10 pb-24 md:pb-12 shrink-0">
            <Button variant="agregar">
              Agregar
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Notas;
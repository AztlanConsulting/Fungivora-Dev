import React, { useState } from "react";
import Base from "../../layout/Base";
import Titulo from "../basics/Titulo";
import Button from "../buttons/Botones";
import Input from "../inputs/InputTexto";
import Text from "../basics/Texto";
import InputFecha from "../inputs/InputFecha";
import TarjetaNota from "../cards/AreaNotas"
import { colores } from "../basics/Colores";

function Notas({ notas = [], cargando, error, codigoBloque = "Bloque" }) {
  const [contenido, setContenido] = useState("");
  const [fecha, setFecha] = useState({ day: "", month: "", year: "" });
  const [verHistorial, setVerHistorial] = useState(false);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Sin fecha";
    const d = new Date(fechaISO);
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
};

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/*Notas a la izquierda*/}
      <div
        className={`flex-col w-full md:w-1/2 h-full border-r-2 border-gray-200 
        ${verHistorial ? "flex" : "hidden"} md:flex relative`}
      >
        <Titulo>Notas de {codigoBloque}</Titulo>

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

              <div className="flex flex-col gap-8 items-center w-full">
                {cargando ? (
                    <Text variante="body">Cargando notas...</Text>
                ) : error ? (
                    <Text variante="body" style={{ color: "red" }}>{error}</Text>
                ) : notas.length === 0 ? (
                    <Text variante="body" style={{ color: colores.gris }}>Sin notas registradas.</Text>
                ) : (
                    notas.map((nota) => (
                        <TarjetaNota
                            key={nota.id_bitacora}
                            fecha={formatearFecha(nota.fecha_bitacora)}
                            preview={nota.notas_bitacora}
                        />
                    ))
                )}
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
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
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
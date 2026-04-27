import React, { useState } from "react";
import Base from "../componentes/base";
import Titulo from "../componentes/titulo";
import BarraBusqueda from "../componentes/barra_busqueda";
import Text from "../componentes/texto";
import { colores } from "../componentes/colores";

function VistaTablas() {

  const [busqueda, setBusqueda] = useState("");

  const [nuevaFila, setNuevaFila] = useState({ campo1: "", campo2: "", campo3: "" });

  const [datos, setDatos] = useState([
    { campo1: "Campo 1", campo2: "Campo 2", campo3: "Campo 3" },
    { campo1: "Campo 1", campo2: "Campo 2", campo3: "Campo 3" },
    { campo1: "Campo 1", campo2: "Campo 2", campo3: "Campo 3" },
  ]);

  const handleNuevaFila = (campo, valor) => {
    const actualizada = { ...nuevaFila, [campo]: valor };
    setNuevaFila(actualizada);

    if (actualizada.campo1 && actualizada.campo2 && actualizada.campo3) {
      setDatos((prev) => [...prev, actualizada]);
      setNuevaFila({ campo1: "", campo2: "", campo3: "" });
    }
  };

  const datosFiltrados = datos.filter((fila) =>
    Object.values(fila).some((val) =>
      val.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const inputStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "clamp(12px, 1.2vw, 14px)",
    color: colores.gris,
    fontStyle: "italic",
    width: "100%",
  };

  // Estilo de borde individual por rectángulo
  const bordeFilaStyle = {
    outline: `2px solid ${colores.azul}`,
    borderRadius: "2px",
    overflow: "hidden",
    marginBottom: "0px",
  };

  return (
    <>
      <Titulo>Tablas...</Titulo>

      <Base margen_arriba="mt-20 md:mt-36">
        <div className="flex flex-col gap-4">

          <BarraBusqueda
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar ..."
          />

          <div className="w-full flex flex-col">

            {/** Encabezado  */}
            <div
              className="grid grid-cols-3 rounded-xl overflow-hidden mb-1.5"
              style={{
                backgroundColor: colores.verde,
                outline: "2px solid #025E3C",
                borderRadius: "2px",
                 marginBottom: "0px",
              }}
            >
              {["Encabezado 1", "Encabezado 2", "Encabezado 3"].map((enc, i) => (
                <div key={i} className="px-4 py-3">
                  <Text variante="selected" style={{ fontSize: "clamp(12px, 1.2vw, 16px)" }}>
                    {enc}
                  </Text>
                </div>
              ))}
            </div>

            {/** Fila editable — borde azul individual */}
            <div
              className="grid grid-cols-3"
              style={{
                ...bordeFilaStyle,
                backgroundColor: "#E8EAF6",
              }}
            >
              {["campo1", "campo2", "campo3"].map((campo, i) => (
                <div key={i} className="px-4 py-3">
                  <input
                    type="text"
                    value={nuevaFila[campo]}
                    onChange={(e) => handleNuevaFila(campo, e.target.value)}
                    placeholder="Escribe"
                    className="bg-transparent outline-none placeholder-gray-400"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            {/** Filas confirmadas — cada una con su propio borde azul */}
            {datosFiltrados.map((fila, index) => (
              <div
                key={index}
                className="grid grid-cols-3"
                style={{
                  ...bordeFilaStyle,
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#E8EAF6",
                }}
              >
                {Object.values(fila).map((valor, i) => (
                  <div key={i} className="px-4 py-3">
                    <Text
                      variante="body"
                      style={{ color: colores.gris, fontStyle: "italic" }}
                    >
                      {valor}
                    </Text>
                  </div>
                ))}
              </div>
            ))}

            {/** Mensaje cuando no hay resultados */}
            {datosFiltrados.length === 0 && (
              <div className="px-4 py-6 text-center">
                <Text variante="body" style={{ color: colores.gris }}>
                  No se encontraron resultados.
                </Text>
              </div>
            )}

          </div>
        </div>
      </Base>
    </>
  );
}

export default VistaTablas;
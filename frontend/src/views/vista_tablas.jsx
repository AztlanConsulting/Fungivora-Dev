import React, { useState } from "react";
import Base from "../componentes/base";
import Titulo from "../componentes/titulo";
import BarraBusqueda from "../componentes/barra_busqueda";
import Text from "../componentes/texto";
import { colores } from "../componentes/colores";

function VistaTablas() {

  // Estado de la barra de búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Estado de la fila editable (inputs vacíos al inicio)
  const [nuevaFila, setNuevaFila] = useState({ campo1: "", campo2: "", campo3: "" });

  // Filas confirmadas de la tabla
  const [datos, setDatos] = useState([
    { campo1: "Campo 1", campo2: "Campo 2", campo3: "Campo 3" },
    { campo1: "Campo 1", campo2: "Campo 2", campo3: "Campo 3" },
    { campo1: "Campo 1", campo2: "Campo 2", campo3: "Campo 3" },
  ]);

  // Actualiza el valor de un campo en la fila editable sin guardar aún
  const handleNuevaFila = (campo, valor) => {
    setNuevaFila((prev) => ({ ...prev, [campo]: valor }));
  };

  // Guarda la fila al presionar Enter, solo si los tres campos tienen contenido
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (nuevaFila.campo1 && nuevaFila.campo2 && nuevaFila.campo3) {
        setDatos((prev) => [...prev, nuevaFila]);
        setNuevaFila({ campo1: "", campo2: "", campo3: "" }); // limpia los inputs
      }
    }
  };

  // Filtra las filas confirmadas en tiempo real según el texto de búsqueda
  const datosFiltrados = datos.filter((fila) =>
    Object.values(fila).some((val) =>
      val.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  // Estilo compartido para los inputs de la fila editable
  const inputStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "clamp(12px, 1.2vw, 14px)",
    color: colores.gris,
    fontStyle: "italic",
    width: "100%",
  };

  // Borde individual con outline para evitar que se duplique el grosor entre filas
  const bordeFilaStyle = {
    outline: `2px solid ${colores.azul}`,
    borderRadius: "2px",
    overflow: "hidden",
    marginBottom: "0px",
  };

  return (
    <>
      <Titulo>Tablas...</Titulo>

      <Base margen_arriba="mt-36 md:mt-36">
        <div className="flex flex-col gap-4">

          {/** Barra de búsqueda — filtra las filas en tiempo real */}
          <BarraBusqueda
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar ..."
          />

          <div className="w-full flex flex-col">

            {/** Encabezado verde — solo visible en desktop (hidden en móvil) */}
            <div
              className="hidden md:grid md:grid-cols-3 overflow-hidden"
              style={{
                backgroundColor: colores.verde,
                outline: "2px solid #025E3C", // borde verde oscuro distinto al de las filas
                borderRadius: "2px",
                marginBottom: "0px",
                position: "relative",
                zIndex: 1, // queda por encima del outline de la primera fila
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

            {/**
             * Fila editable
             * Desktop: 3 inputs en columnas (grid-cols-3)
             * Móvil: 3 inputs apilados verticalmente en una tarjeta
             */}
            <div
              className="grid grid-cols-3 md:grid-cols-3"
              style={{ ...bordeFilaStyle, backgroundColor: "#E8EAF6" }}
            >
              {/** Móvil: inputs apilados — se oculta en desktop con md:hidden */}
              <div className="col-span-3 md:hidden px-4 py-3 flex flex-col gap-1">
                {["campo1", "campo2", "campo3"].map((campo, i) => (
                  <input
                    key={i}
                    type="text"
                    value={nuevaFila[campo]}
                    onChange={(e) => handleNuevaFila(campo, e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe"
                    className="bg-transparent outline-none placeholder-gray-400 w-full"
                    style={inputStyle}
                  />
                ))}
              </div>

              {/** Desktop: inputs en columnas — se oculta en móvil con hidden md:block */}
              {["campo1", "campo2", "campo3"].map((campo, i) => (
                <div key={i} className="hidden md:block px-4 py-3">
                  <input
                    type="text"
                    value={nuevaFila[campo]}
                    onChange={(e) => handleNuevaFila(campo, e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe"
                    className="bg-transparent outline-none placeholder-gray-400"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            {/**
             * Filas confirmadas
             * Alternan entre blanco y azul muy claro (#E8EAF6)
             * Desktop: 3 columnas | Móvil: tarjeta con campo1 arriba y campo2+campo3 abajo
             */}
            {datosFiltrados.map((fila, index) => (
              <div
                key={index}
                style={{
                  ...bordeFilaStyle,
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#E8EAF6",
                }}
              >
                {/** Móvil: campo1 en azul/negrita, campo2 y campo3 en fila debajo */}
                <div className="md:hidden px-4 py-3">
                  <Text variante="selected" style={{ color: colores.azul }}>
                    {fila.campo1}
                  </Text>
                  <div className="flex gap-6 mt-1">
                    <Text variante="body" style={{ color: colores.gris, fontStyle: "italic" }}>
                      {fila.campo2}
                    </Text>
                    <Text variante="body" style={{ color: colores.gris, fontStyle: "italic" }}>
                      {fila.campo3}
                    </Text>
                  </div>
                </div>

                {/** Desktop: los tres valores en columnas */}
                <div className="hidden md:grid md:grid-cols-3">
                  {Object.values(fila).map((valor, i) => (
                    <div key={i} className="px-4 py-3">
                      <Text variante="body" style={{ color: colores.gris, fontStyle: "italic" }}>
                        {valor}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/** Mensaje cuando la búsqueda no encuentra resultados */}
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
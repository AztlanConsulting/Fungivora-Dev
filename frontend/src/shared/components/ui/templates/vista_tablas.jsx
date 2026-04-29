import React, { useState } from "react";
import Base from "../../layout/base";
import Titulo from "../basics/titulo";
import BarraBusqueda from "../others/barra_busqueda";
import Text from "../basics/texto";
import { colores } from "../basics/colores";

// Acceso a los estilos definidos en Text para aplicarlos a inputs
const estilosReferencia = {
  input: {
    fontStyle: "italic",
    fontSize: "clamp(10px, 1.5vw, 12px)",
    color: "#868889",
  }
};

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

  // Color constante basado en tu header
  const colorBordeHeader = "#F2F2FC";

  return (
    <>
      <Titulo>Tablas...</Titulo>

      <Base margen_arriba="mt-24 md:mt-20">
        <div className="flex flex-col gap-4">

          {/** Barra de búsqueda — filtra las filas en tiempo real */}
          < BarraBusqueda
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar ..."
          />

          {/** * Contenedor Principal de la Tabla 
           * md:border: Borde exterior con el color del header
           * overflow-hidden: Para que el redondeado del header y la base se aplique correctamente
           */}
          <div
            className="w-full flex flex-col md:border md:rounded-xl overflow-hidden"
            style={{ borderColor: colorBordeHeader }}
          >

            {/** Encabezado */}
            <div
              className="hidden md:grid md:grid-cols-3"
              style={{
                backgroundColor: colorBordeHeader,
                marginBottom: "0px",
              }}
            >
              {["Encabezado 1", "Encabezado 2", "Encabezado 3"].map((enc, i) => (
                <div key={i} className="px-4 py-3">
                  <Text variante="option">
                    {enc}
                  </Text>
                </div>
              ))}
            </div>

            {/**
             * Fila editable
             */}
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ backgroundColor: "#FFFFFF", borderBottom: `1px solid ${colorBordeHeader}` }}
            >
              {/** Vista Móvil: Inputs apilados */}
              <div className="col-span-3 md:hidden px-4 py-3 flex flex-col gap-1 border-2 mb-2 rounded-lg" style={{ borderColor: colorBordeHeader }}>
                <input
                  type="text"
                  value={nuevaFila["campo1"]}
                  onChange={(e) => handleNuevaFila("campo1", e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe..."
                  className="bg-transparent outline-none placeholder-gray-400 w-full"
                  style={{ fontSize: "16px", color: colores.azul, fontStyle: "italic" }}
                />
                <div className="flex gap-0">
                  {["campo2", "campo3"].map((campo, i) => (
                    <input
                      key={i}
                      type="text"
                      value={nuevaFila[campo]}
                      onChange={(e) => handleNuevaFila(campo, e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe..."
                      className="bg-transparent outline-none placeholder-gray-400 w-full"
                      style={{ fontSize: "14px", color: colores.azul, fontStyle: "italic" }}
                    />
                  ))}
                </div>
              </div>

              {/** Vista Desktop: Inputs en columnas */}
              {["campo1", "campo2", "campo3"].map((campo, i) => (
                <div key={i} className="hidden md:block px-4 py-4">
                  <input
                    type="text"
                    value={nuevaFila[campo]}
                    onChange={(e) => handleNuevaFila(campo, e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe..."
                    className="bg-transparent outline-none placeholder-gray-400 w-full"
                    style={{ fontSize: "16px", color: colores.azul, fontStyle: "italic" }}
                  />
                </div>
              ))}
            </div>

            {/**
             * Filas confirmadas
             * Solo borde inferior para separar registros
             */}
            {datosFiltrados.map((fila, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3"
                style={{
                  backgroundColor: "#FFFFFF",
                  // La última fila no lleva borde inferior para no chocar con el borde del contenedor
                  borderBottom: index === datosFiltrados.length - 1 ? "none" : `1px solid ${colorBordeHeader}`,
                }}
              >
                {/** Móvil */}
                <div className="md:hidden px-4 py-3 border-2 mb-2 rounded-lg" style={{ borderColor: colorBordeHeader }}>
                  <Text variante="option" style={{ color: colores.azul }}>
                    {fila.campo1}
                  </Text>
                  <div className="flex gap-32 mt-3">
                    <Text variante="body" style={{ color: colores.gris }}>
                      {fila.campo2}
                    </Text>
                    <Text variante="body" style={{ color: colores.gris }}>
                      {fila.campo3}
                    </Text>
                  </div>
                </div>


                {Object.values(fila).map((valor, i) => (
                  <div key={i} className="hidden md:block px-4 py-4">
                    <Text variante="body" style={{ color: colores.gris, fontStyle: "italic" }}>
                      {valor}
                    </Text>
                  </div>
                ))}
              </div>
            ))}

            {datosFiltrados.length === 0 && (
              <div className="px-4 py-10 text-center bg-white">
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
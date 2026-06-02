import React, { useState } from "react";
import Base from "../../layout/Base";
import Titulo from "../basics/Titulo";
import Button from "../buttons/Botones";
import Input from "../inputs/InputTexto";
import Text from "../basics/Texto";
import InputFecha from "../inputs/InputFecha";
import TarjetaNota from "../cards/AreaNotas"
import { colores } from "../basics/Colores";
import Slider from "../inputs/Slider";
import ModalAlerta from "../popups/ModalAlerta";

function Notas({ notas = [], cargando, error, codigo = "Sin código", onAgregar, id }) {
  const [contenido, setContenido] = useState("");
  const hoy = new Date();
  const [fecha, setFecha] = useState({
    day: String(hoy.getDate()).padStart(2, "0"),
    month: String(hoy.getMonth() + 1).padStart(2, "0"),
    year: String(hoy.getFullYear())
  });
  const [modalAlerta, setModalAlerta] = useState({visible: false, variante: "exito", mensaje:""});
  const [errorForm, setErrorForm] = useState(false);
  const [verHistorial, setVerHistorial] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [porcColonizacion, setPorcColonizacion] = useState(0);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Sin fecha";
    const d = new Date(fechaISO);
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  };

  const handleAgregar = async () => {
    if (!contenido.trim() || !fecha.day || !fecha.month || !fecha.year) {
      setErrorForm(true);
      return;
    };
    setErrorForm(false);
    try {
        setGuardando(true);
        await onAgregar({
            id_bloque: id,
            fecha: `${fecha.year}-${fecha.month}-${fecha.day}`,
            notas_bitacora: contenido,
            porc_colonizacion: porcColonizacion
        });
        setContenido("");
        const hoyReset = new Date();
        setFecha({
          day: String(hoyReset.getDate()).padStart(2, "0"),
          month: String(hoyReset.getMonth() + 1).padStart(2, "0"),
          year: String(hoyReset.getFullYear())
        });
        setModalAlerta({ visible: true, variante: "exito", mensaje: "Nota creada con éxito." });
    } catch (e) {
        console.error("Error al agregar nota", e);
        setModalAlerta({ visible: true, variante: "error", mensaje: "Hubo un error al crear la nota." });
    } finally {
        setGuardando(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/*Notas a la izquierda*/}
      <div
        className={`flex-col w-full md:w-1/2 h-full border-r-2 border-gray-200 
        ${verHistorial ? "flex" : "hidden"} md:flex relative`}
      >
        <Titulo>Notas de {codigo}</Titulo>

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
                      {verHistorial ? "Historial" : "Notas"}
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
                            porcentaje={nota.porc_colonizacion}
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
        <Titulo color="white">Notas de {codigo}</Titulo>
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
                  <Text variante="label">
                    {verHistorial ? "Historial" : "Notas"}
                  </Text>
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

              <Text> Porcentaje de colonización: {porcColonizacion}%</Text>
              <Slider 
                value={porcColonizacion} 
                onChange={setPorcColonizacion}
              />
            </div>
          </div>

          <div className="flex-1 min-h-[10px]" />

          {errorForm && (
            <Text variante="body" style={{ color: "red", fontSize: "16px", fontWeight: "600", textAlign: "center" }}>
              Por favor completa los campos correctamente.
            </Text>
          )}

          <div className="mt-auto w-full flex justify-center pt-10 pb-24 md:pb-12 shrink-0">
            <Button variant="agregar" onClick={handleAgregar} disabled={guardando}>
              {guardando ? "Guardando..." : "Agregar"}
            </Button>
          </div>

        </div>

      </div>

      <ModalAlerta
        visible={modalAlerta.visible}
        variante={modalAlerta.variante}
        mensaje={modalAlerta.mensaje}
        onClose={() => setModalAlerta(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

export default Notas;
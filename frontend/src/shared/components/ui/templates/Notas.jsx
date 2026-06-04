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
    <div className="flex flex-col h-screen w-full overflow-hidden">

      <Titulo>Notas de {codigo}</Titulo>

      {/* Divisor principal */}
      <Base margen_arriba="mt-16 md:mt-20">
        <div className="w-full h-[calc(100vh-8rem)] bg-white rounded-[32px] shadow-sm border flex flex-col overflow-hidden">

          {/* Switch móvil */}
          <div className="md:hidden px-6 pt-4 shrink-0 border-b border-gray-100 pb-4">
            <div
              onClick={() => setVerHistorial(!verHistorial)}
              className={`px-4 h-8 rounded-md transition-all cursor-pointer inline-flex items-center justify-center
                ${verHistorial ? "ring-4" : "ring-2"} ring-[var(--input-ring)]`}
              style={{ "--input-ring": verHistorial ? colores.verde : colores.azul, backgroundColor: "#F9FDFF" }}
            >
              <Text variante="label">{verHistorial ? "Historial" : "Notas"}</Text>
            </div>
          </div>

          {/* Separador de los paneles */}
          <div className="flex flex-1 overflow-hidden">

            {/* Panel izquierdo — Historial */}
            <div
              className={`flex-col w-full md:w-1/2 h-full border-r border-gray-100
              ${verHistorial ? "flex" : "hidden"} md:flex`}
            >
              <div className="px-6 md:px-8 pt-5 pb-4 border-b border-gray-100 shrink-0">
                <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "18px" }}>
                  Historial
                </Text>
              </div>

              {/* Lista con scroll */}
              <div className="flex-1 overflow-y-auto scrollbar-thin px-6 md:px-8 py-4">
                {cargando ? (
                  <div className="flex items-center justify-center h-full">
                    <Text variante="body">Cargando notas...</Text>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <Text variante="body" style={{ color: "red" }}>{error}</Text>
                  </div>
                ) : notas.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <Text variante="body" style={{ color: colores.gris }}>Sin notas registradas.</Text>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {notas.map((nota) => (
                      <TarjetaNota
                        key={nota.id_bitacora}
                        fecha={formatearFecha(nota.fecha_bitacora)}
                        preview={nota.notas_bitacora}
                        porcentaje={nota.porc_colonizacion}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Panel derecho — Nueva entrada */}
            <div
              className={`flex-col w-full md:w-1/2 h-full
              ${verHistorial ? "hidden" : "flex"} md:flex`}
            >
              <div className="px-6 md:px-8 pt-5 pb-4 border-b border-gray-100 shrink-0">
                <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "18px" }}>
                  Nueva entrada
                </Text>
              </div>

              {/* Formulario con scroll */}
              <div className="flex-1 overflow-y-auto scrollbar-thin px-6 md:px-8 py-6 flex flex-col">
                <div className="w-full max-w-sm mx-auto flex flex-col gap-6 flex-1">
                  <div className="flex flex-col gap-4">
                    <InputFecha value={fecha} onChange={setFecha} />
                    <Input
                      variante="amplio"
                      placeholder="Escribe tu entrada larga..."
                      value={contenido}
                      onChange={(e) => setContenido(e.target.value)}
                    />
                    <Text>Porcentaje de colonización: {porcColonizacion}%</Text>
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

                <div className="w-full flex justify-center pt-6 pb-6 shrink-0">
                  <Button variant="agregar" onClick={handleAgregar} disabled={guardando}>
                    {guardando ? "Guardando..." : "Agregar"}
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Base>

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
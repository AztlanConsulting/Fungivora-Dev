import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/titulo";
import Text from "../../shared/components/ui/basics/texto";
import { colores } from "../../shared/components/ui/basics/colores";
import useLotes from "../../features/lotes/hooks/useLotes";
import SelectField from "../../shared/components/ui/inputs/seleccionar_texto";
import InputFecha from "../../shared/components/ui/inputs/input_fecha";
import Button from "../../shared/components/ui/buttons/botones";

import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

function Lotes() {
  const columnas = [
    { label: "Código de Lote", key: "codigo_fungivora" },
    { label: "Sustrato", key: "tipo_sustrato" },
    { label: "Ubicación", key: "ubicacion_lote" },
    { label: "Estado", key: "fase" },
    { label: "Fecha", key: "fecha_lote" }
  ];

  const navigate = useNavigate();


  // Acciones de use Lotes
  const { datos, sustratos, ubicaciones, especies, cargando, error, addLote } = useLotes();

  const [fecha, setFecha] = useState({ day: "", month: "", year: "" });
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [verFormulario, setVerFormulario] = useState(false);
  const [nuevaFila, setNuevaFila] = useState({ tipo_sustrato: "", ubicacion_lote: "", id_inoculo: "" });
  const [errorValidacion, setErrorValidacion] = useState("");

  // Agregar nueva fila al añadir
  const handleNuevaFila = (campo, valor) => {
    if (valor && typeof valor === 'object' && 'value' in valor) {
      setNuevaFila((prev) => ({ ...prev, [campo]: valor.value }));
    }
    else if (valor?.target) {
      setNuevaFila((prev) => ({ ...prev, [campo]: valor.target.value }));
    }
    else {
      setNuevaFila((prev) => ({ ...prev, [campo]: valor || "" }));
    }
  };

  // Verificación de los campos
  const handleGuardarLote = async () => {
    const { ubicacion_lote, tipo_sustrato, id_inoculo } = nuevaFila;

    if (!ubicacion_lote || !tipo_sustrato || !id_inoculo) {
      setErrorValidacion("Por favor, completa los campos");
      return;
    }

    setErrorValidacion("");
    const exito = await addLote(nuevaFila);

    if (exito) {

      setNuevaFila({
        tipo_sustrato: "",
        ubicacion_lote: "",
        id_inoculo: ""
      });
      setVerFormulario(false);
    }
  };

  /**
   * Navega al detalle pasando el objeto completo por state
   */
  const handleVerDetalle = (lote) => {
    navigate(`/lotes/detalle/${lote.id_lote}`, {
      state: {
        id: lote.id_lote,
        fecha: lote.fecha_lote,
        sustrato: lote.tipo_sustrato,
        ubicacion: lote.ubicacion_lote,
        id_inoculo_usado: lote.id_inoculo,
        codigo: lote.codigo_fungivora,
        fase: lote.fase,
        especie: lote.nombre_especie || "Shiitake" // Asumiendo que el hongo viene en el objeto
      }
    });
    console.log("Navegando a detalle con lote:", lote);
  };

  const obtenerEstiloFase = (fase) => {
    const f = fase?.toLowerCase() || "";
    if (f.includes("cosecha")) return { bg: "#E8F5E9", text: "#2E7D32" };
    if (f.includes("inoculación")) return { bg: "#FFEBEE", text: "#C62828" };
    if (f.includes("colonización")) return { bg: "#FFF3E0", text: "#EF6C00" };
    if (f.includes("finalización") || f.includes("finalizado")) return { bg: "#E3F2FD", text: "#1565C0" };
    if (f.includes("fructificación")) return { bg: "#fff5cc", text: "#c7a200" };
    return { bg: "#F5F5F5", text: "#616161" };
  };

  const colorBordeHeader = "#F2F2FC";
  const gridLayout = "grid-cols-1 md:grid-cols-[1.2fr_1fr_1.1fr_1.2fr_1fr_0.5fr]";

  return (
    <>
      <Titulo>Lotes</Titulo>

      <Base margen_arriba="mt-20 md:mt-20">
        {/* Boton de moviles */}
        <div className="lg:hidden w-full mb-6">
          <div
            onClick={() => setVerFormulario(!verFormulario)}
            className={`px-7 py-3 rounded-[15px] transition-all duration-300 cursor-pointer inline-flex items-center justify-center border-2 
              ${verFormulario ? "bg-white border-[#3b3fb6] shadow-sm" : "bg-white border-gray-200"}`}
          >
            <Text variante="label" style={{ color: verFormulario ? colores.azul : "#6B7280", fontWeight: "500", fontSize: "14px" }}>
              {verFormulario ? "Ver Lotes" : "Crear lote"}
            </Text>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className={`w-full bg-white rounded-[32px] shadow-sm border p-4 md:p-8 md:pl-16 min-h-[500px] ${verFormulario ? "hidden" : "block"} lg:block`}>

            {cargando && datos.length === 0 ? (
              <div className="flex justify-center items-center h-[400px]"><Text variante="medium">Cargando lotes...</Text></div>
            ) : error ? (
              <div className="flex justify-center items-center h-[400px]"><Text variante="medium" style={{ color: 'red' }}>Error al conectar</Text></div>
            ) : (
              <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>

                {/* Header Desktop */}
                <div className={`hidden md:grid ${gridLayout}`} style={{ backgroundColor: colorBordeHeader }}>
                  {columnas.map((col, i) => (
                    <div key={i} className="px-6 py-4">
                      <Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>{col.label}</Text>
                    </div>
                  ))}
                  <div className="px-6 py-4"></div>
                </div>

                <div className="max-h-[605px] md:max-h-[550px] overflow-y-auto flex flex-col gap-3 md:gap-0">
                  {datos.map((lote) => {
                    const estiloFase = obtenerEstiloFase(lote.fase);
                    const fechaFormateada = new Date(lote.fecha_lote).toLocaleDateString();

                    return (
                      <div key={lote.id_lote}>
                        {/* Vista Móvil */}
                        <div
                          onClick={() => handleVerDetalle(lote)}
                          className="md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                          style={{ borderColor: colorBordeHeader }}
                        >
                          <div className="flex justify-between items-start">
                            <Text variante="option" style={{ color: colores.black, fontWeight: '700', fontSize: '18px' }}>{lote.codigo_fungivora}</Text>
                            <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                          </div>
                          <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                            <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{lote.tipo_sustrato}</Text>
                            <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{lote.ubicacion_lote}</Text>
                            <div>
                              <span className="px-2 py-0.5 rounded-md text-[12px] font-bold" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                                {lote.fase}
                              </span>
                            </div>
                            <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{fechaFormateada}</Text>
                          </div>
                        </div>

                        {/* Vista Desktop */}
                        <div
                          onClick={() => handleVerDetalle(lote)}
                          className={`hidden md:grid ${gridLayout} cursor-pointer transition-all border-b hover:bg-slate-50`}
                          style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}
                        >
                          {columnas.map((col, i) => (
                            <div key={i} className="px-6 py-5 flex items-center justify-start">
                              {col.key === 'fase' ? (
                                <div className="px-4 py-1 rounded-lg text-sm font-bold" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                                  {lote[col.key]}
                                </div>
                              ) : (
                                <Text variante="option" style={{ color: "black", fontSize: "15px", fontWeight: col.key === 'codigo_fungivora' ? '700' : '400' }}>
                                  {col.key === 'fecha_lote' ? fechaFormateada : lote[col.key]}
                                </Text>
                              )}
                            </div>
                          ))}
                          <div className="py-4 flex justify-center items-center">
                            <HugeiconsIcon
                              icon={CancelCircleIcon}
                              size={24}
                              color={colores.azul}
                              onClick={(e) => { e.stopPropagation(); /* lógica borrar */ }}
                              className="hover:opacity-80 transition-opacity"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Formulario lateral */}
          <div className={`w-full lg:w-[440px] h-fit bg-white rounded-[32px] shadow-sm border p-8 flex flex-col ${verFormulario ? "block" : "hidden"} lg:block`}>
            <div className="mb-8">
              <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Lote</Text>
            </div>
            <div className="flex flex-col gap-5">
              {/* Seleccionar Inoculo - Especie*/}
              <div className="flex flex-col gap-2">
                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Inóculo / (Especie)</Text>
                <SelectField
                  placeholder="Selecciona inóculo"
                  size="forms"
                  options={especies}
                  value={nuevaFila.id_inoculo}
                  onChange={(opcion) => handleNuevaFila("id_inoculo", opcion)}
                />
              </div>

              {/* Seleccionar sustrato*/}
              <div className="flex flex-col gap-2">
                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Sustrato</Text>
                <SelectField
                  placeholder="Selecciona un sustrato"
                  size="forms"
                  options={sustratos}
                  value={nuevaFila.tipo_sustrato}
                  onChange={(opcion) => handleNuevaFila("tipo_sustrato", opcion)}
                />
              </div>

              {/* Seleccionar ubicación*/}
              <div className="flex flex-col gap-2">
                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Ubicación</Text>
                <SelectField
                  placeholder="Selecciona una ubicación"
                  size="forms"
                  options={ubicaciones}
                  value={nuevaFila.ubicacion_lote}
                  onChange={(opcion) => handleNuevaFila("ubicacion_lote", opcion)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Fecha</Text>
                <InputFecha value={fecha} onChange={setFecha} />
              </div>
            </div >
            {errorValidacion && (
              <div className="text-center mt-4"><Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{errorValidacion}</Text></div>
            )
            }
            <div className="flex justify-center pt-4">
              <Button variant="primario" size="lg" className="w-full" onClick={handleGuardarLote}>Crear Lote</Button>
            </div>
          </div >
        </div >
      </Base >
    </>
  );
}

export default Lotes;
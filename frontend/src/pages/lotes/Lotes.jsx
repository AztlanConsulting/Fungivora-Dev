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
import useBloques from "../../features/bloques/hooks/useBloques";

import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon, Add01Icon } from '@hugeicons/core-free-icons';

function Lotes() {
  const columnas = [
    { label: "Código de Lote", key: "codigo_fungivora" },
    { label: "Sustrato", key: "tipo_sustrato" },
    { label: "Ubicación", key: "ubicacion_lote" },
    { label: "Estado", key: "fase" },
    { label: "Fecha", key: "fecha_lote" }
  ];

  const navigate = useNavigate();

  const hoy = new Date();
  const [fecha, setFecha] = useState({
    day: hoy.getDate().toString().padStart(2, '0'),
    month: (hoy.getMonth() + 1).toString().padStart(2, '0'),
    year: hoy.getFullYear().toString()
  });

  const { datos, sustratos, ubicaciones, especies, cargando, error, addLote } = useLotes();

  const [verFormulario, setVerFormulario] = useState(false);
  const [nuevaFila, setNuevaFila] = useState({ tipo_sustrato: "", ubicacion_lote: "", id_inoculo: "" });
  const [errorValidacion, setErrorValidacion] = useState("");

  const [paso, setPaso] = useState(1);
  const { bloquesTemporales, contenedores, agregarBloqueALista, eliminarBloqueDeLista, limpiarLista } = useBloques();
  
  const [bloqueForm, setBloqueForm] = useState({ 
    contenedor: "", 
    peso_gr: "", 
    cantidad: "1",
    produccion: "1" 
  });

  const handleNuevaFila = (campo, valor) => {
  // Si valor es el evento de un select nativo o un objeto complejo de una librería
  if (valor && typeof valor === 'object') {
    // Si viene de un componente que devuelve {label, value}
    if ('value' in valor) {
      setNuevaFila((prev) => ({ ...prev, [campo]: String(valor.value) }));
    } 
    // Si por error llega el evento sintético de React
    else if (valor.target) {
      setNuevaFila((prev) => ({ ...prev, [campo]: valor.target.value }));
    }
  } else {
    // Si es un valor simple (string/number)
    setNuevaFila((prev) => ({ ...prev, [campo]: valor || "" }));
  }
};

// Añade esto cerca de handleNuevaFila
const handleBloqueForm = (campo, valor) => {
  if (valor && typeof valor === 'object') {
    if ('value' in valor) {
      setBloqueForm((prev) => ({ ...prev, [campo]: String(valor.value) }));
    } else if (valor.target) {
      setBloqueForm((prev) => ({ ...prev, [campo]: valor.target.value }));
    }
  } else {
    setBloqueForm((prev) => ({ ...prev, [campo]: valor || "" }));
  }
};

  const irAPasoBloques = () => {
    const { ubicacion_lote, tipo_sustrato, id_inoculo } = nuevaFila;
    if (!ubicacion_lote || !tipo_sustrato || !id_inoculo) {
      setErrorValidacion("Por favor, completa los datos del lote");
      return;
    }
    setErrorValidacion("");
    setPaso(2);
  };
  const handleEliminarBloque = (id) => {
    eliminarBloqueDeLista(id);
  };

const handleFinalizarRegistroCompleto = async () => {
  try {
    if (bloquesTemporales.length === 0) {
      setErrorValidacion("Añade al menos un bloque");
      return;
    }

    const datosParaEnviar = {
      // Los IDs se envían como String para respetar el formato UUID
      id_inoculo: String(nuevaFila.id_inoculo),
      tipo_sustrato: String(nuevaFila.tipo_sustrato),
      ubicacion_lote: String(nuevaFila.ubicacion_lote),
      fecha_lote: `${fecha.year}-${fecha.month}-${fecha.day}`,
      
      // La producción del lote (basada en el primer bloque o general)
      produccion: Number(bloquesTemporales[0]?.produccion) || 1, 

      bloques: bloquesTemporales.map(b => ({
        contenedor: String(b.contenedor), // Texto plano
        peso_gr: Number(b.peso_gr) || 0,   // Número
        cantidad: Number(b.cantidad) || 1, // Número
        produccion: Number(b.produccion) || 1 // Número
      }))
    };

    console.log("Enviando a API:", datosParaEnviar);

    const respuesta = await addLote(datosParaEnviar);
    
    if (respuesta && (respuesta.success || respuesta.id_lote)) {
      window.location.reload(); 
    } else {
      setErrorValidacion(respuesta?.message || "Error en el servidor");
    }
  } catch (err) {
    console.error("Error al enviar:", err);
    setErrorValidacion("Error de conexión con el servidor");
  }
};

  const handleVerDetalle = (lote) => {
    navigate(`/lotes/detalle/${lote.id_lote}`, {
      state: {
        id: lote.id_lote,
        fecha: lote.fecha_lote,
        sustrato: lote.tipo_sustrato,
        ubicacion: lote.ubicacion_lote,
        id_inoculo_usado: lote.id_inoculo,
        codigo: lote.codigo_fungivora,
        fase: lote.fase
      }
    });
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

{paso === 1 ? (
              // TABLA DE LOTES EXISTENTES (Tu código original)
              <>
                <div className="mb-4"><Text variante="medium" style={{color: colores.azul, fontWeight: '700'}}>Lista de Lotes</Text>
            {cargando && datos.length === 0 ? (
              <div className="flex justify-center items-center h-[400px]"><Text variante="medium">Cargando lotes...</Text></div>
            ) : error ? (
              <div className="flex justify-center items-center h-[400px]"><Text variante="medium" style={{ color: 'red' }}>Error al conectar</Text></div>
            ) : (
              <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>

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
                        <div
                          onClick={() => handleVerDetalle(lote)}
                          className="md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                          style={{ borderColor: colorBordeHeader }}
                        >
                          <div className="flex justify-between items-start">
                            <Text variante="option" style={{ color: colores.black, fontWeight: '500', fontSize: '18px' }}>{lote.codigo_fungivora}</Text>
                            <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                          </div>
                          <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                            <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{lote.tipo_sustrato}</Text>
                            <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{lote.ubicacion_lote}</Text>
                            <div>
                              <span className="px-2 py-0.5 rounded-md text-[12px] font-semibold" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                                {lote.fase}
                              </span>
                            </div>
                            <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{fechaFormateada}</Text>
                          </div>
                        </div>

                        <div
                          onClick={() => handleVerDetalle(lote)}
                          className={`hidden md:grid ${gridLayout} cursor-pointer transition-all border-b hover:bg-slate-50`}
                          style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}
                        >
                          {columnas.map((col, i) => (
                            <div key={i} className="px-6 py-5 flex items-center justify-start">
                              {col.key === 'fase' ? (
                                <div className="px-4 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                                  {lote[col.key]}
                                </div>
                              ) : (
                                <Text variante="option" style={{ color: "black", fontSize: "15px", fontWeight: col.key === 'codigo_fungivora' ? '600' : '400' }}>
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
                              onClick={(e) => { e.stopPropagation(); }}
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
          </>
            ) : (
              // NUEVA TABLA DE BLOQUES TEMPORALES
              <div className="animate-in fade-in duration-500">
                <div className="mb-6 flex justify-between items-center">
                  <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "20px" }}>
                    Bloques a crear para este lote
                  </Text>
                  <Text variante="label" style={{ color: colores.gris }}>
                    Total: {bloquesTemporales.length} bloques
                  </Text>
                </div>

                <div className="flex flex-col border rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
                  <div className="hidden md:grid grid-cols-4" style={{ backgroundColor: colorBordeHeader }}>
                    <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontWeight: '600' }}>Contenedor</Text></div>
                    <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontWeight: '600' }}>Peso (gr)</Text></div>
                    <div className="px-6 py-4"><Text variante="medium" style={{ color: colores.azul, fontWeight: '600' }}>Cantidad</Text></div>
                    <div className="px-6 py-4"></div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {bloquesTemporales.map((bloque) => (
  <div key={bloque.id_temp} className="grid grid-cols-2 md:grid-cols-4 border-b hover:bg-slate-50 items-center" style={{ borderColor: colorBordeHeader }}>
    
    {/* CORRECCIÓN: Validamos que bloque.contenedor no sea un objeto */}
    <div className="px-6 py-4">
  <Text variante="option">
    {/* Si es objeto, intentamos mostrar 'label' o 'value', si no, el string */}
    {typeof bloque.contenedor === 'object' 
      ? (bloque.contenedor.label || bloque.contenedor.value) 
      : bloque.contenedor}
  </Text>
</div>

    <div className="px-6 py-4">
      <Text variante="option">
        {typeof bloque.peso_gr === 'object' ? '0' : bloque.peso_gr}g
      </Text>
    </div>

    <div className="px-4 py-4 hidden md:block">
      <Text variante="option">
        {typeof bloque.cantidad === 'object' ? '0' : bloque.cantidad}
      </Text>
    </div>

    <div className="px-6 py-4 hidden md:block">
      <span className={`px-2 py-1 rounded text-[10px] font-bold ${bloque.produccion === "1" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
        {Number(bloque.produccion) === 1 ? "PROD" : "EXP"}
      </span>
    </div>

    <div className="px-6 py-4 flex justify-end">
      <button onClick={() => handleEliminarBloque(bloque.id_temp)} className="text-red-400 hover:text-red-600 transition-colors">
        <HugeiconsIcon icon={CancelCircleIcon} size={20} />
      </button>
    </div>
  </div>
))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`w-full lg:w-[440px] h-fit bg-white rounded-[32px] shadow-sm border p-8 flex flex-col ${verFormulario ? "block" : "hidden"} lg:block`}>
            {paso === 1 ? (
              <>
                <div className="mb-8">
                  <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Paso 1: Crear Lote</Text>
                </div>

                <div className="flex flex-col gap-5">
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

                  {errorValidacion && (
                    <div className="text-center mt-2">
                      <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{errorValidacion}</Text>
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                    <Button variant="primario" size="lg" className="w-full" onClick={irAPasoBloques}>
                      Siguiente: Configurar Bloques
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-8 flex justify-between items-center">
                  <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Paso 2: Bloques</Text>
                  <button 
                    onClick={() => setPaso(1)} 
                    className="text-xs underline text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Volver al Lote
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
  <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Contenedor</Text>
  <SelectField 
    options={contenedores} 
    placeholder="Tipo de bolsa/frasco"
    size="forms"
    value={bloqueForm.contenedor} 
    onChange={(opcion) => handleBloqueForm("contenedor", opcion)} 
  />
</div>

{/* FINALIDAD */}
<div className="flex flex-col gap-2">
  <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Finalidad del Bloque</Text>
  <SelectField
    placeholder="Selecciona tipo"
    size="forms"
    options={[
      { value: "1", label: "Producción" },
      { value: "0", label: "Experimental" }
    ]}
    value={bloqueForm.produccion}
    onChange={(opcion) => handleBloqueForm("produccion", opcion)}
  />
</div>

                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Peso (gr)</Text>
                      <input 
                        type="number" 
                        placeholder="0.0"
                        value={bloqueForm.peso_gr}
                        className="border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100" 
                        onChange={(e) => setBloqueForm({...bloqueForm, peso_gr: e.target.value})} 
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Cantidad</Text>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={bloqueForm.cantidad}
                        className="border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100" 
                        onChange={(e) => setBloqueForm({...bloqueForm, cantidad: e.target.value})} 
                      />
                    </div>
                  </div>
<Button variant="secundario" onClick={() => {
    // Validación simple
    if (!bloqueForm.contenedor || !bloqueForm.peso_gr) {
      setErrorValidacion("Selecciona un contenedor y un peso válido.");
      return;
    }

    // Los datos YA están limpios gracias a handleBloqueForm
    const bloqueLimpio = {
      contenedor: bloqueForm.contenedor,
      peso_gr: String(bloqueForm.peso_gr),
      cantidad: String(bloqueForm.cantidad || "1"),
      produccion: bloqueForm.produccion
    };

    agregarBloqueALista(bloqueLimpio);
    
    // Resetear
    setBloqueForm({ 
      contenedor: "", 
      peso_gr: "", 
      cantidad: "1", 
      produccion: "1" 
    });
    setErrorValidacion("");
}}>
  Añadir a la lista
</Button>
                  <hr className="my-2 border-gray-100" />

                  {errorValidacion && (
                    <div className="text-center">
                      <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{errorValidacion}</Text>
                    </div>
                  )}

                  <Button variant="primario" size="lg" className="w-full" onClick={handleFinalizarRegistroCompleto}>
                    Finalizar y Guardar Todo
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Base>
    </>
  );
}

export default Lotes;
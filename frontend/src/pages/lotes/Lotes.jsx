import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Base from "../../shared/components/layout/base";
import Titulo from "../../shared/components/ui/basics/titulo";
import Text from "../../shared/components/ui/basics/texto";
import { colores } from "../../shared/components/ui/basics/colores";
import useLotes from "../../features/lotes/hooks/useLotes";
import useBloques from "../../features/bloques/hooks/useBloques";
import Button from "../../shared/components/ui/buttons/botones";
import ModalConfirmacion from "../../shared/components/ui/popups/modal_confirmacion"; 

// Iconos
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon} from '@hugeicons/core-free-icons';

// Componentes de Tablas y Forms
import TablaLotes from "../../features/lotes/components/TablaLotes";
import TablaBloques from "../../features/bloques/components/TablaBloques";
import FormCrearLote from "../../features/lotes/components/FormCrearLote";
import FormCrearBloque from "../../features/bloques/components/FormCrearBloque";

function Lotes() {

  const columnas = [
    { label: "Código de Lote", key: "codigo_fungivora" },
    { label: "Sustrato", key: "tipo_sustrato" },
    { label: "Ubicación", key: "ubicacion_lote" },
    { label: "Estado", key: "fase" },
    { label: "Fecha", key: "fecha_lote" }
  ];

  // Tener la fecha de hoy en el input
  const navigate = useNavigate();
  const hoy = new Date();
  const [fecha, setFecha] = useState({
    day: hoy.getDate().toString().padStart(2, '0'),
    month: (hoy.getMonth() + 1).toString().padStart(2, '0'),
    year: hoy.getFullYear().toString()
  });

  const { datos, sustratos, ubicaciones, especies, especiesDisponibles,
  getInoculosPorEspecie, cargando, error, addLote } = useLotes();
  const [verFormulario, setVerFormulario] = useState(false);
  const [nuevaFila, setNuevaFila] = useState({ especie: "", tipo_sustrato: "", ubicacion_lote: "", id_inoculo: "" });
  const [errorValidacion, setErrorValidacion] = useState("");
  const [codigoPrevisualizacion, setCodigoPrevisualizacion] = useState("");
  const [paso, setPaso] = useState(1);
  const { bloquesTemporales, contenedores, agregarBloqueALista, eliminarBloqueDeLista } = useBloques();
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    // Obtener el código de lote
    if (paso === 2 && nuevaFila.id_inoculo) {
      const dd = String(fecha.day).padStart(2, '0');
      const mm = String(fecha.month).padStart(2, '0');
      const yy = fecha.year.toString().slice(-2);
      setCodigoPrevisualizacion(`LC-XX-${dd}${mm}${yy}-X`);
    }
  }, [paso, nuevaFila.id_inoculo, fecha]);

  // Colores para podruccion y experimental
  const colores_tipo = {
    produccion: { bg: "#DDEEE9", text: "#23916F" }, 
    experimental: { bg: "#E9EAFF", text: "#272CBA" } 
  };

  const [bloqueForm, setBloqueForm] = useState({ contenedor: "", peso_gr: "", cantidad: "", produccion: "" });

  // Que cambie el valor de los inputs de select
  const handleInputChange = (setter) => (campo, valor) => {
    const value = (valor && typeof valor === 'object' && 'value' in valor) ? String(valor.value) : (valor?.target ? valor.target.value : valor);
    setter((prev) => ({ ...prev, [campo]: value || "" }));
  };

  // Cambiar de lotes a bloques en el registro
  const irAPasoBloques = () => {
    if (!nuevaFila.ubicacion_lote || !nuevaFila.tipo_sustrato || !nuevaFila.id_inoculo) {
      setErrorValidacion("Por favor, completa los datos");
      return;
    }
    setErrorValidacion("");
    setPaso(2);
  };

  // Agregar el bloque y su validación
  const handleAgregarBloque = () => {
    if (!bloqueForm.contenedor || !bloqueForm.peso_gr) {
      setErrorValidacion("Completa los campos del bloque");
      return;
    }
    agregarBloqueALista({ ...bloqueForm });
    setBloqueForm({ contenedor: "", peso_gr: "", cantidad: "", produccion: "" });
    setErrorValidacion("");
  };

  // Obligar a añadir al menos 1 bloque
  const previsualizarRegistro = () => {
    if (bloquesTemporales.length === 0) {
      setErrorValidacion("Añade al menos un bloque");
      return;
    }
    setErrorValidacion("");
    setMostrarModal(true);
  };

  // Guardar todo el registro completo
  const handleFinalizarRegistroCompleto = async () => {
    if (bloquesTemporales.length === 0) {
      setErrorValidacion("Añade al menos un bloque");
      return;
    }
    const datosParaEnviar = {
      ...nuevaFila,
      fecha_lote: `${fecha.year}-${fecha.month}-${fecha.day}`,
      produccion: Number(bloquesTemporales[0].produccion),
      bloques: bloquesTemporales.map(b => ({ ...b, peso_gr: Number(b.peso_gr), cantidad: Number(b.cantidad), produccion: Number(b.produccion) }))
    };
    const respuesta = await addLote(datosParaEnviar);
    if (respuesta?.success || respuesta?.id_lote) window.location.reload();
    else setErrorValidacion(respuesta?.message || " Error en el servidor");
  };

  // Colores de las fases
  const obtenerEstiloFase = (fase) => {
    const f = fase?.toLowerCase() || "";
    if (f.includes("cosecha")) return { bg: "#E8F5E9", text: "#2E7D32" };
    if (f.includes("inoculación")) return { bg: "#FFEBEE", text: "#C62828" };
    if (f.includes("colonización")) return { bg: "#FFF3E0", text: "#EF6C00" };
    if (f.includes("fructificación")) return { bg: "#fff5cc", text: "#c7a200" };
    return { bg: "#F5F5F5", text: "#616161" };
  };

  return (
    <Base margen_arriba="mt-20 md:mt-20">
      {/* Botón para cambiar del forms a la vista de tabla*/}
    <div className="lg:hidden flex justify-start mb-6">
      <div
        onClick={() => setVerFormulario(!verFormulario)}
        className={`px-5 py-2 rounded-[12px] border-2 bg-white transition-all active:scale-95 cursor-pointer shadow-sm
          ${verFormulario ? "border-[#3b3fb6]" : "border-gray-200"}`}
      >
        <Text 
          variante="label" 
          style={{ 
            color: verFormulario ? colores.azul : "#6B7280", 
            fontWeight: "600",
            fontSize: "13px"
          }}
        >
          {verFormulario 
            ? (paso === 1 ? "Ver Lotes" : "Ver Bloques") 
            : (paso === 1 ? "Crear lote" : "Crear bloque")
          }
        </Text>
      </div>
    </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch relative">
        {/* Componente de las tablas*/}
        <div className={`w-full bg-white rounded-[32px] shadow-sm border p-4 md:p-8 md:pl-16 min-h-[500px] ${verFormulario ? "hidden" : "block"} lg:block`}>
          {paso === 1 ? (
            <>
              <Titulo>Lotes</Titulo>
              {cargando ? <Text>Cargando...</Text> : (
                <TablaLotes 
                  datos={datos} 
                  columnas={columnas} 
                  onVerDetalle={(lote) => navigate(`/lotes/detalle/${lote.id_lote}`, { state: lote })}
                  obtenerEstiloFase={obtenerEstiloFase}
                  gridLayout="grid-cols-1 md:grid-cols-[1.2fr_1fr_1.1fr_1.2fr_1fr_0.5fr]"
                  colorBordeHeader="#F2F2FC"
                />
              )}
            </>
          ) : (
            <div className="animate-in fade-in duration-500">
              <TablaBloques 
              codigo={codigoPrevisualizacion}
                bloques={bloquesTemporales} 
                onEliminar={eliminarBloqueDeLista}
                estilosTipo={colores_tipo}
                gridLayout="grid-cols-1 md:grid-cols-[1.2fr_1fr_1.2fr_1.2fr_0.5fr]"
                colorBordeHeader="#F2F2FC"
              />
            </div>
          )}
        </div>

        {/* Componentes de formularios*/}
        <div className="flex flex-col lg:w-[440px]">
          <div className={`w-full bg-white rounded-[32px] shadow-sm border p-8 ${verFormulario ? "block" : "hidden"} lg:block`}>
            {paso === 1 ? (
              <FormCrearLote 
                especiesDisponibles={especiesDisponibles} 
                getInoculosPorEspecie={getInoculosPorEspecie}
                especies={especies} 
                sustratos={sustratos} 
                ubicaciones={ubicaciones}
                nuevaFila={nuevaFila} 
                fecha={fecha} 
                setFecha={setFecha}
                handleNuevaFila={handleInputChange(setNuevaFila)} 
                onSiguiente={irAPasoBloques} 
                error={errorValidacion}
              />
            ) : (
              <FormCrearBloque 
                codigo={codigoPrevisualizacion} contenedores={contenedores}
                bloqueForm={bloqueForm} setBloqueForm={setBloqueForm}
                handleBloqueForm={handleInputChange(setBloqueForm)} onAgregar={handleAgregarBloque} error={errorValidacion}
              />
            )}
          </div>

        {/* Botones de registrar y cancelar*/}
          {paso === 2 && (
            <div className={`flex flex-col md:flex-row gap-4 mt-8 items-center md:justify-end ${verFormulario ? "flex" : "hidden"} lg:flex`}>
              <div className="order-1 md:order-2">
                <Button variant="registrar" onClick={previsualizarRegistro}>Registrar</Button> 
              </div>
              <div className="order-2 md:order-1">
                <Button variant="eliminar" isOutline={true} onClick={() => setPaso(1)}>Cancelar</Button> 
              </div>
            </div>
          )}
        </div> 
      </div>  

     {/* Modal para confirmar el registro*/}
      <ModalConfirmacion
        visible={mostrarModal}
        titulo="¿Confirmar registro de lote?"
        descripcion={`Se registrará el lote con ${bloquesTemporales.length} bloques.`}
        textoConfirmar="Registrar"
        textoCancelar="Cancelar"
        icon={CheckmarkCircle02Icon}
        onConfirm={handleFinalizarRegistroCompleto}
        onCancel={() => setMostrarModal(false)}
      /> 
    </Base>
  );
}

export default Lotes;
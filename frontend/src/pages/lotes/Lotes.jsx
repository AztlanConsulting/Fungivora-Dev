import React, { useState, useEffect, useCallback } from "react"; 
import { useNavigate, useLocation } from 'react-router-dom';
import Base from "../../shared/components/layout/Base";
import Titulo from "../../shared/components/ui/basics/Titulo";
import Text from "../../shared/components/ui/basics/Texto";
import { colores } from "../../shared/components/ui/basics/Colores";
import useLotes from "../../features/lotes/hooks/useLotes";
import useBloques from "../../features/bloques/hooks/useBloques";
import Button from "../../shared/components/ui/buttons/Botones";
import ModalConfirmacion from "../../shared/components/ui/popups/ModalConfirmacion";
import ModalAlerta from "../../shared/components/ui/popups/ModalAlerta";

// Iconos
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, CancelCircleIcon } from '@hugeicons/core-free-icons';

// Componentes de Tablas y Forms
import TablaLotes from "../../features/lotes/components/TablaLotes";
import TablaBloques from "../../features/bloques/components/TablaBloquesEditable";
import FormCrearLote from "../../features/lotes/components/FormCrearLote";
import FormCrearBloque from "../../features/bloques/components/FormCrearBloque";

function Lotes() {

  const columnas = [
    { label: "Código de Lote", key: "codigo_fungivora" },
    { label: "Ubicación", key: "ubicacion_lote" },
    { label: "Estado", key: "fase" },
    { label: "Fecha", key: "fecha_lote" },
    { label: "Eliminar", key: "eliminar"}
  ];

  // Tener la fecha de hoy en el input
  const navigate = useNavigate();
  const hoy = new Date();
  const [fecha, setFecha] = useState({
    day: hoy.getDate().toString().padStart(2, '0'),
    month: (hoy.getMonth() + 1).toString().padStart(2, '0'),
    year: hoy.getFullYear().toString()
  });

  const {
    datos, ubicaciones, especiesDisponibles,
    getInoculosPorEspecie, cargando, error, addLote, deleteLote
  } = useLotes();
  const [verFormulario, setVerFormulario] = useState(false);
  const [nuevaFila, setNuevaFila] = useState({ especie: "", ubicacion_lote: ""});
  const [errorValidacion, setErrorValidacion] = useState("");
  const [codigoPrevisualizacion, setCodigoPrevisualizacion] = useState("");
  const [paso, setPaso] = useState(1);
  const { bloquesTemporales, sustratos, contenedores, agregarBloqueALista, eliminarBloqueDeLista } = useBloques();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState({ visible: false, variante: "exito", mensaje: "" });
  const [loteAEliminar, setLoteAEliminar] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);

  const location = useLocation();
    
  const abrirModalCancelar = useCallback(() => {
    if (bloquesTemporales.length > 0) {
      setMostrarModalCancelar(true);
    } else {
      setPaso(1);
      setErrorValidacion("");
    }
  }, [bloquesTemporales.length]);

  useEffect(() => {
    if (location.state?.resetPaso) {
      if (paso === 2) {
        if (bloquesTemporales.length > 0) {
          setMostrarModalCancelar(true);
        } else {
          setPaso(1);
          setErrorValidacion("");
        }
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, paso, bloquesTemporales.length, navigate, location.pathname]);

  const irAPasoBloques = () => {
    if (!nuevaFila.especie || !nuevaFila.ubicacion_lote) {
      setErrorValidacion("Por favor, completa los datos del lote");
      return;
    }
    
    setErrorValidacion("");
    setPaso(2); 

    setVerFormulario(true); 
  };

  useEffect(() => {
    if (nuevaFila.id_inoculo && nuevaFila.especie) {
      const opcionesInoculo = getInoculosPorEspecie(nuevaFila.especie);
      const seleccionado = opcionesInoculo.find(
        opt => String(opt.value) === String(nuevaFila.id_inoculo)
      );

      if (seleccionado) {
        const dd = String(fecha.day).padStart(2, '0');
        const mm = String(fecha.month).padStart(2, '0');
        const yy = fecha.year.toString().slice(-2);
        const abreviatura = seleccionado.abreviatura || "XX";

        setCodigoPrevisualizacion(`LC-${abreviatura}-${dd}${mm}${yy}`);
      }
    } else {
      setCodigoPrevisualizacion("");
    }
  }, [nuevaFila.id_inoculo, nuevaFila.especie, fecha, getInoculosPorEspecie]);


  // Colores para podruccion y experimental
  const colores_tipo = {
    produccion: { bg: "#DDEEE9", text: "#23916F" },
    experimental: { bg: "#E9EAFF", text: "#272CBA" }
  };

  const [bloqueForm, setBloqueForm] = useState({ id_inoculo: "", contenedor: "", peso_gr: "", cantidad: "", produccion: "", tipo_sustrato: "" });

  // Que cambie el valor de los inputs de select
  const handleInputChange = (setter) => (campo, valor) => {
    const value = (valor && typeof valor === 'object' && 'value' in valor)
      ? String(valor.value)
      : (valor?.target ? valor.target.value : valor);

    setter((prev) => {
      const nuevoEstado = { ...prev, [campo]: value || "" };
      if (campo === "especie") {
        nuevoEstado.id_inoculo = "";
        setCodigoPrevisualizacion("");
      }

      return nuevoEstado;
    });
  };

  // Agregar el bloque y su validación
  const handleAgregarBloque = () => {
    const { peso_gr, cantidad, id_inoculo, contenedor, tipo_sustrato, produccion } = bloqueForm;

    if (!id_inoculo || !contenedor || !peso_gr || !cantidad || !tipo_sustrato || !produccion) {
      setErrorValidacion("Completa todos los campos");
      return;
    }

    const numPeso = Number(peso_gr);
    const numCantidad = parseInt(cantidad, 10); 

    if (isNaN(numPeso) || numPeso <= 0 || isNaN(numCantidad) || numCantidad <= 0) {
      setErrorValidacion("Ingresa un número válido y mayor a cero");
      return;
    }

    const cantidadAcumulada = bloquesTemporales.reduce((acc, bloque) => acc + Number(bloque.cantidad), 0);
    const nuevoTotal = cantidadAcumulada + numCantidad;

    if (nuevoTotal > 100) {
      setErrorValidacion(`Capacidad máxima alcanzada - 100 bloques en total.`);
      return;
    }

    if (nuevoTotal === 100) {
      console.log("Has alcanzado el límite máximo de 100 bloques.");
    }

    const opcionesInoculo = getInoculosPorEspecie(nuevaFila.especie);
    const inoculoSeleccionado = opcionesInoculo.find(
      opt => String(opt.value) === String(id_inoculo)
    );

    agregarBloqueALista({ 
      ...bloqueForm, 
      cantidad: String(numCantidad), 
      nombre_inoculo: inoculoSeleccionado ? inoculoSeleccionado.label : "N/A" 
    });

    setAlerta({
      visible: true,
      variante: "exito",
      mensaje: "Bloque añadido a la lista correctamente"
    });
    
    setBloqueForm({ id_inoculo: "", contenedor: "", peso_gr: "", cantidad: "", produccion: "", tipo_sustrato: "" });
    setErrorValidacion("");
  };

  const confirmarCancelacion = () => {
    setPaso(1);
    bloquesTemporales.forEach(bloque => {
      eliminarBloqueDeLista(bloque.id_temp);
    });
    setBloqueForm({ id_inoculo: "", contenedor: "", peso_gr: "", cantidad: "", produccion: "", tipo_sustrato: "" });
    setNuevaFila({ especie: "", ubicacion_lote: "" }); 
    setErrorValidacion("");
    setMostrarModalCancelar(false);
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
    if (guardando || bloquesTemporales.length === 0) return;

    setGuardando(true);
    setErrorValidacion("");
    setMostrarModal(false);

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
    try {
      const respuesta = await addLote(datosParaEnviar);

      if (respuesta?.success || respuesta?.id_lote) {
        setAlerta({
          visible: true,
          variante: "exito",
          mensaje: "Lote y bloques registrados exitosamente"
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } else {
        setGuardando(false);
        setAlerta({
          visible: true,
          variante: "error",
          mensaje: "Error al guardar: " + (respuesta?.message || "Error desconocido")
        });
      }
    } catch {
      setGuardando(false);
      setAlerta({
        visible: true,
        variante: "error",
        mensaje: "Error de conexión con el servidor"
      });
    }
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

  // Modal para confirmar eliminar
  const prepararEliminacion = (lote) => {
    setLoteAEliminar(lote);
    setMostrarModalEliminar(true);
  };

  // Confirmar eliminar el lote
  const confirmarEliminarLote = async () => {
    if (!loteAEliminar) return;

    setGuardando(true);
    try {
      const res = await deleteLote(loteAEliminar.id_lote);

      if (res.success) {
        setAlerta({
          visible: true,
          variante: "exito",
          mensaje: "Lote eliminado correctamente"
        });
      } else {
        setAlerta({
          visible: true,
          variante: "error",
          mensaje: res.message || "No se pudo eliminar"
        });
      }
    } catch {
      setAlerta({ visible: true, variante: "error", mensaje: "Error de red" });
    } finally {
      setGuardando(false);
      setMostrarModalEliminar(false);
      setLoteAEliminar(null);
    }
  };

  const totalUnidadesBloques = bloquesTemporales.reduce((acc, bloque) => acc + Number(bloque.cantidad || 0), 0);

  return (
    <Base margen_arriba="mt-20 md:mt-20">
      {/* Botón para cambiar del forms a la vista de tabla*/}
      <div className="lg:hidden flex justify-start mb-6">
        <Button
          onClick={() => setVerFormulario(!verFormulario)}
          className={`px-5 py-2 rounded-[12px] border-2`}
          isOutline={true}
        >
          <Text
            variante="label"
            style={{
              color: colores.azul,
              fontWeight: "600",
              fontSize: "13px"
            }}
          >
            {verFormulario
              ? (paso === 1 ? "Ver Lotes" : "Ver Bloques")
              : (paso === 1 ? "Crear lote" : "Crear bloque")
            }
          </Text>
        </Button>

      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch relative">
        {/* Componente de las tablas*/}
        <div className={`w-full bg-white rounded-[32px] shadow-sm border p-4 md:p-8 md:pl-8 min-h-[500px] ${verFormulario ? "hidden" : "block"} lg:block`}>
          {paso === 1 ? (
            <>
              <Titulo>Lotes</Titulo>
              {cargando ? <Text>Cargando...</Text> : error ? <Text>Error al cargar los datos</Text> : (
                <TablaLotes
                  datos={datos}
                  onEliminar={prepararEliminacion}
                  columnas={columnas}
                  onVerDetalle={(lote) => navigate(`/lotes/detalle/${lote.id_lote}`, { state: lote })}
                  obtenerEstiloFase={obtenerEstiloFase}
                  gridLayout="grid-cols-1 md:grid-cols-[1.2fr_1.1fr_1.2fr_1fr_0.5fr]"
                  colorBordeHeader="#F2F2FC"
                />
              )}
            </>
          ) : (
            <div className="animate-in fade-in duration-500">
              <Titulo>Bloques</Titulo>
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
                codigo={codigoPrevisualizacion}
                sustratos={sustratos}
                contenedores={contenedores}
                setAlerta={setAlerta}
                bloqueForm={bloqueForm}
                setBloqueForm={setBloqueForm}
                handleBloqueForm={handleInputChange(setBloqueForm)}
                onAgregar={handleAgregarBloque}
                error={errorValidacion}
                especieSeleccionada={nuevaFila.especie}
                getInoculosPorEspecie={getInoculosPorEspecie}
                idInoculoSeleccionado={nuevaFila.id_inoculo}
              />
            )}
          </div>

          {/* Botones de registrar y cancelar*/}
          {paso === 2 && (
            <div className={`flex flex-col md:flex-row gap-4 mt-8 items-center justify-center ${verFormulario ? "flex" : "hidden"} lg:flex`}>
              
              <div className="w-full md:w-auto flex justify-center">
                <Button
                  className="w-full md:w-auto"
                  variant="registrar"
                  onClick={previsualizarRegistro}
                  isOutline={true} 
                  disabled={guardando}
                >
                  {guardando ? "Cargando..." : "Finalizar"}
                </Button>
              </div>

              <div className="w-full md:w-auto flex justify-center"> 
                <Button 
                  className="w-full md:w-[150px]" 
                  variant="eliminar" 
                  isOutline={true} 
                  onClick={abrirModalCancelar}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>


      <ModalAlerta
        visible={alerta.visible}
        variante={alerta.variante}
        mensaje={alerta.mensaje}
        onClose={() => setAlerta({ ...alerta, visible: false })}
      />

      {/* Modal para confirmar el registro*/}
      <ModalConfirmacion
        visible={mostrarModal}
        titulo={"¿Confirmar registro de lote?"}
        descripcion={`Se registrará el lote con ${totalUnidadesBloques} bloques.`}
        textoConfirmar="Registrar"
        textoCancelar="Cancelar"
        icon={CheckmarkCircle02Icon}
        onConfirm={handleFinalizarRegistroCompleto}
        onCancel={() => !guardando && setMostrarModal(false)}
        deshabilitarConfirmar={guardando}
      />
      <ModalConfirmacion
        visible={mostrarModalEliminar}
        titulo={"¿Eliminar este lote?"}
        descripcion={`Se eliminará el lote ${loteAEliminar?.codigo_fungivora} y sus bloques asociados permanentemente.`}
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        icon={CancelCircleIcon}
        onConfirm={confirmarEliminarLote}
        onCancel={() => setMostrarModalEliminar(false)}
        deshabilitarConfirmar={guardando}
      />
      <ModalConfirmacion
        visible={mostrarModalCancelar}
        titulo="¿Estás seguro de cancelar?"
        descripcion="Se perderán todos los bloques que has añadido actualmente."
        textoConfirmar="Sí, cancelar"
        textoCancelar="Continuar editando"
        icon={CancelCircleIcon} 
        colorConfirmar={colores.rojo}
        onConfirm={confirmarCancelacion}
        onCancel={() => setMostrarModalCancelar(false)}
      />
    </Base>
  );
}

export default Lotes;
import React, { useState} from "react";
import Base from "../../shared/components/layout/Base";
import Titulo from "../../shared/components/ui/basics/Titulo";
import Text from "../../shared/components/ui/basics/Texto";
import { colores } from "../../shared/components/ui/basics/Colores";
import useInsumos from "../../features/inventario/hooks/useInsumos";
import ModalAlerta from "../../shared/components/ui/popups/ModalAlerta";
import ModalConfirmacion from "../../shared/components/ui/popups/ModalConfirmacion";
import Button from "../../shared/components/ui/buttons/Botones";
import Input from "../../shared/components/ui/inputs/InputTexto";

import TablaInventario from "../../features/inventario/components/TablaInventario";
import FormularioInsumo from "../../features/inventario/components/FormularioInsumo";

const Inventario = () => {
  const { insumos, unidades, loading, addInsumo, updateInsumo } = useInsumos();
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [nuevaFila, setNuevaFila] = useState({ nombre: "", cantidad: "", stock_recomendado: "", unidad: "" });
  const [errorValidacion, setErrorValidacion] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);
  const [modalEdicion, setModalEdicion] = useState({ visible: false, insumo: null });
  const [ajusteCantidad, setAjusteCantidad] = useState("");
  const [tipoOperacion, setTipoOperacion] = useState("incremento");
  const [alerta, setAlerta] = useState({ visible: false, mensaje: "", variante: "exito" });
  const [guardando, setGuardando] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState({ visible: false, datos: null });

  // Grid de la tabla
  const gridLayout = "grid-cols-1 md:grid-cols-[1.5fr_2.2fr_1fr_1fr]";

  const lanzarAlerta = (mensaje, variante = "exito") => setAlerta({ visible: true, mensaje, variante });

  // Modal de editar cantidad
  const abrirModalEdicion = (item) => {
    setModalEdicion({ visible: true, insumo: item });
    setAjusteCantidad("");
    setTipoOperacion("incremento");
    setErrorModal("");
  };

  // Confirmar editar cantidad
  const handleConfirmarAjuste = async () => {
    const cambio = parseFloat(ajusteCantidad);
    if (isNaN(cambio) || cambio <= 0) {
      setErrorModal("Ingresa una cantidad válida");
      return;
    }

    const cantidadActual = parseFloat(modalEdicion.insumo.cantidad) || 0;
    if (tipoOperacion === "reduccion" && cambio > cantidadActual) {
      setErrorModal(`Stock insuficiente (Disponible: ${cantidadActual})`);
      return;
    }

    let nuevaCantidad = tipoOperacion === "incremento"
      ? cantidadActual + cambio
      : cantidadActual - cambio;

    nuevaCantidad = parseFloat(nuevaCantidad.toFixed(2));

    const esInoculo = modalEdicion.insumo.tipo !== 'insumo';
    const id = esInoculo
      ? modalEdicion.insumo.id
      : (modalEdicion.insumo.id_insumo ?? modalEdicion.insumo.id);

    const exito = await updateInsumo(id, { cantidad: nuevaCantidad }, esInoculo ? 'inoculo' : 'insumo');
    if (exito) {
      setModalEdicion({ visible: false, insumo: null });
      lanzarAlerta("¡Stock actualizado correctamente!");
    }
  };

  // Manejar cambio de números en el ajuste
  const handleCambioAjuste = (valor) => {
    const valorEstandarizado = valor.replace(",", ".");
    const regex = /^\d{0,6}(\.\d{0,2})?$/;
    if (regex.test(valorEstandarizado)) setAjusteCantidad(valorEstandarizado);
  };

  // Añadir nueva fila de insumo 
  const handleNuevaFila = (campo, valor) => {
    if (errorValidacion) setErrorValidacion("");

    if (campo === "cantidad" || campo === "stock_recomendado") {
      const valorEstandarizado = valor.replace(",", ".");
      const regex = /^\d{0,5}(\.\d{0,2})?$/;

      if (regex.test(valorEstandarizado)) {
        setNuevaFila(prev => ({ ...prev, [campo]: valorEstandarizado }));
      }
    } else {
      setNuevaFila(prev => ({ ...prev, [campo]: valor }));
    }
  };

  const handleGuardarInsumo = () => {
    if (!nuevaFila.nombre || !nuevaFila.cantidad || !nuevaFila.unidad) {
      setErrorValidacion("Completa todos los campos");
      return;
    }
    setModalConfirmacion({ visible: true, datos: nuevaFila });
  };

  const handleConfirmarCreacion = async () => {
    setModalConfirmacion({ visible: false, datos: null });
    setGuardando(true);
    const resultado = await addInsumo(nuevaFila);
    setGuardando(false);

    if (resultado.success) {
      setNuevaFila({ nombre: "", cantidad: "", stock_recomendado: "", unidad: "" });
      setVerFormulario(false);
      setErrorValidacion("");
      lanzarAlerta("Insumo creado con éxito");
    } else {
      setErrorValidacion(resultado.error);
    }
  };

  return (
    <>
      <Titulo>Inventario</Titulo>
      <Base margen_arriba="mt-20 md:mt-20">

        {/* Botón Móvil */}
        <div className="lg:hidden flex justify-start mb-6">
          <Button
            onClick={() => setVerFormulario(!verFormulario)}
            className="px-5 py-2 rounded-[12px] border-2"
            isOutline={true}>
            <Text
              variante="label"
              style={{ color: colores.azul, fontWeight: "600", fontSize: "13px" }}>
              {verFormulario ? "Ver Inventario" : "Crear insumo"}
            </Text>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Columnas*/}
          <div className={`w-full lg:flex-1 bg-white rounded-[32px] shadow-sm border p-4 md:p-8 ${verFormulario ? "hidden" : "block"} lg:block`}>
            <TablaInventario
              insumos={insumos}
              loading={loading}
              filaSeleccionada={filaSeleccionada}
              setFilaSeleccionada={setFilaSeleccionada}
              abrirModalEdicion={abrirModalEdicion}
              gridLayout={gridLayout}
            />
          </div>

          {/* Formulario */}
          <div className={`w-full lg:w-[440px] bg-white rounded-[32px] shadow-sm border p-8 ${verFormulario ? "block" : "hidden"} lg:block lg:mt-0`}>
            <FormularioInsumo
              nuevaFila={nuevaFila}
              handleNuevaFila={handleNuevaFila}
              handleGuardarInsumo={handleGuardarInsumo}
              unidades={unidades}
              errorValidacion={errorValidacion}
              guardando={guardando}
            />
          </div>
        </div>

        {/* Modal de editar cantidad*/}
        {modalEdicion.visible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalEdicion({ visible: false, insumo: null })} />
              <div className="relative bg-white rounded-[30px] p-9 w-full max-w-lg shadow-2xl flex flex-col gap-6 border animate-in zoom-in duration-200">
              <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", textAlign: "center" }}>
                {modalEdicion.insumo?.nombre}
              </Text>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setTipoOperacion("incremento")} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${tipoOperacion === "incremento" ? "bg-green-100 shadow-sm text-green-600" : "text-gray-500"}`}>Entrada</button>
                <button onClick={() => setTipoOperacion("reduccion")} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${tipoOperacion === "reduccion" ? "bg-red-100 shadow-sm text-red-600" : "text-gray-500"}`}>Salida</button>
              </div>

              <Input
                variante="decimal"
                placeholder="0.00"
                value={ajusteCantidad}
                onChange={(e) => handleCambioAjuste(e.target.value)}
                className="w-full"
              />
              {errorModal && <Text variante="label" style={{ color: "#E53E3E", fontSize: "13px" }}>{errorModal}</Text>}
                <div className="flex flex-row gap-3 w-full justify-center">
                  <Button variant="cancelar" isOutline onClick={() => setModalEdicion({ visible: false, insumo: null })}>Cancelar</Button>
                  <Button variant="confirmar" isOutline onClick={handleConfirmarAjuste}>Confirmar</Button>
                </div>
              </div>
            </div>
        )}

        <ModalConfirmacion
          visible={modalConfirmacion.visible}
          titulo="¿Crear este insumo?"
          descripcion={
            modalConfirmacion.datos
              ? `Se creará "${modalConfirmacion.datos.nombre}" con ${modalConfirmacion.datos.cantidad} ${modalConfirmacion.datos.unidad}.`
              : ""
          }
          textoConfirmar="Crear"
          textoCancelar="Cancelar"
          onConfirm={handleConfirmarCreacion}
          onCancel={() => setModalConfirmacion({ visible: false, datos: null })}
        />
      </Base>

      <ModalAlerta visible={alerta.visible} variante={alerta.variante} mensaje={alerta.mensaje} onClose={() => setAlerta({ ...alerta, visible: false })} />
    </>
  );
};

export default Inventario;
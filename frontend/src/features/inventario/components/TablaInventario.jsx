import React, { useState } from "react";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Remove01Icon, InformationCircleIcon, LabelImportantIcon } from "@hugeicons/core-free-icons";
import ModalInfo from "../../../shared/components/ui/popups/ModalInfo";
import BarraBusqueda from "../../../shared/components/ui/others/BarraBusqueda";

const MENSAJE_INFO_NO_EDITABLE = "No puedes editar la cantidad de este insumo manualmente";

const colorBordeHeader = "#F2F2FC";
const columnasHeader = [
  { label: "Insumo", key: "nombre", align: "start" },
  { label: "Cantidad Actual", key: "cantidad", align: "start" },
  { label: "Estado", key: "estado", align: "center" },
  { label: "Acciones", key: "accion", align: "center" },
];

const TablaInventario = ({ insumos, loading, filaSeleccionada, setFilaSeleccionada, abrirModalEdicion, gridLayout }) => {
  const [mostrarInfoNoEditable, setMostrarInfoNoEditable] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Estado por cantidad
  const obtenerEstado = (cantidad, recomendado) => {
    const cant = parseFloat(cantidad) || 0;
    const rec = parseFloat(recomendado) || 0;
    if (cant <= 0) return { label: "Agotado", color: "#EF4444", bg: "#FEE2E2" };
    if (cant <= rec * 0.5) return { label: "Bajo", color: "#F59E0B", bg: "#FEF3C7" };
    return { label: "Óptimo", color: "#10B981", bg: "#D1FAE5" };
  };

  const insumosFiltrados = insumos.filter((item) => {
    const estadoCalculado = obtenerEstado(item.cantidad, item.stock_recommended || item.stock_recomendado);
    const limpiar = (str) => (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-\s]/g, "");
    
    const nombre = limpiar(item.nombre);
    const estadoLabel = limpiar(estadoCalculado.label);
    const termino = limpiar(busqueda);

    return nombre.includes(termino) || estadoLabel.includes(termino);
  });

  // Número de forma visual mejor
  const formatearNumero = (valor) => {
    const numero = parseFloat(valor);
    if (isNaN(numero)) return "0.00";

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  };

  // Conversión cada 1000 ml/g a L/Kg
  const renderizarCantidad = (cantidad, unidad) => {
    const num = parseFloat(cantidad) || 0;
    const uniNormalizada = unidad ? unidad.trim().toLowerCase().replace(/\.$/, "") : "";
    if (uniNormalizada === "g" || uniNormalizada === "gr" || uniNormalizada.startsWith("gramo")) {
      if (num >= 1000) {
        return `${formatearNumero(num / 1000)} Kilogramo(s)`;
      }
      return `${formatearNumero(num)} Gramo(s)`;
    }

    if (uniNormalizada === "ml" || uniNormalizada.startsWith("mililitro")) {
      if (num >= 1000) {
        return `${formatearNumero(num / 1000)} Litro(s)`;
      }
      return `${formatearNumero(num)} Mililitro(s)`;
    }

    return `${formatearNumero(num)} ${unidad}`;
  };

  return (
    
    <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
      <div className="p-4 bg-white border-b" style={{ borderColor: colorBordeHeader }}>
        <BarraBusqueda 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar insumo..."
        />
      </div>
      {/* Header Desktop */}
      <div className={`hidden md:grid ${gridLayout} items-center min-h-[60px]`} style={{ backgroundColor: colorBordeHeader }}>
        {columnasHeader.map((col, i) => (
          <div key={i} className={`px-3 lg:px-6 flex items-center ${col.align === "center" ? "justify-center" : "justify-start"}`}>
            <Text
              variante="medium"
              style={{ color: colores.azul, fontWeight: 600, fontSize: "16px", whiteSpace: "nowrap" }}>
              {col.label}
            </Text>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="h-auto max-h-[500px] md:max-h-[400px] overflow-y-auto flex flex-col gap-1 md:gap-0">
        {loading ? (
          <div className="flex justify-center items-center h-[200px] w-full">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <Text variante="medium">Cargando datos de insumos...</Text>
            </div>
          </div>
        ) : insumosFiltrados.length === 0 ? (
          <div className="text-center py-10 w-full">
            <Text variante="medium" style={{ color: colores.gris }}>
              {busqueda ? "No se encontraron insumos que coincidan." : "Error de conexión."}
            </Text>
          </div>
        ) : (
        insumosFiltrados.map((item) => {
          const itemId = item.id ?? item.id_insumo;
          const esSeleccionado = filaSeleccionada === itemId;
          const estado = obtenerEstado(item.cantidad, item.stock_recommended || item.stock_recomendado);
          const esInsumo = item.tipo === 'insumo';

          return (
            <div key={itemId} onClick={() => setFilaSeleccionada(itemId)} className="group cursor-pointer">
              {/* Filas Desktop */}
              <div className={`hidden md:grid ${gridLayout} items-center border-b border-gray-50 hover:bg-gray-50 transition-colors`}>
                <div className="px-3 lg:px-6 py-4 min-w-0 flex items-center">
                  <Text variante="option" style={{ color: "black", fontWeight: 600, fontSize: "15px" }}>{item.nombre}</Text>
                </div>
                <div className="px-3 lg:px-6 py-4 min-w-0 flex items-center">
                  <Text variante="option" style={{ color: colores.black, fontWeight: 400, fontSize: "15px" }}>
                    {renderizarCantidad(item.cantidad, item.unidad)}
                  </Text>
                </div>
                <div className="px-3 lg:px-6 py-4 flex justify-center">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold inline-block whitespace-nowrap" style={{ backgroundColor: estado.bg, color: estado.color }}>
                    {estado.label}
                  </span>
                </div>

                {/* Acciones Desktop Condicionado */}
                <div className="flex justify-center p-2">
                  {esInsumo ? (
                    <div className="flex items-center gap-3">
                      {/* IN */}
                      <button
                        type="button"
                        className="hover:scale-110 transition-transform cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalEdicion(item, "incremento");
                        }}
                      >
                        <HugeiconsIcon
                          icon={Add01Icon}
                          size={20}
                          color={colores.azul}
                        />
                      </button>

                      {/* OUT */}
                      <button
                        type="button"
                        className="hover:scale-110 transition-transform cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalEdicion(item, "reduccion");
                        }}
                      >
                        <HugeiconsIcon
                          icon={Remove01Icon}
                          size={20}
                          color={colores.azul}
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="hover:scale-110 transition-transform cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setMostrarInfoNoEditable(true); }}
                      aria-label="Información"
                    >
                      <HugeiconsIcon icon={InformationCircleIcon} size={20} color={colores.azul} />
                    </button>
                  )}
                </div>
              </div>

              {/* Cartas Móvil */}
              <div className="md:hidden mb-1">
                <div className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${esSeleccionado ? 'ring-2' : ''}`}
                  style={{ borderColor: colorBordeHeader }}>
                  <div className="flex justify-between items-start mb-3">
                    <Text variante="option" style={{ color: "black", fontWeight: "600", fontSize: "16px" }}>{item.nombre}</Text>

                    {/* Icono Móvil Condicionado */}
                    {esInsumo ? (
                      <div className="flex items-center gap-3">
                        {/* IN */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalEdicion(item, "incremento");
                          }}
                        >
                          <HugeiconsIcon
                            icon={Add01Icon}
                            size={22}
                            color={colores.azul}
                          />
                        </button>

                        {/* OUT */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalEdicion(item, "reduccion");
                          }}
                        >
                          <HugeiconsIcon
                            icon={Remove01Icon}
                            size={22}
                            color={colores.azul}
                          />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setMostrarInfoNoEditable(true); }}
                        aria-label="Información"
                      >
                        <HugeiconsIcon icon={InformationCircleIcon} size={22} color={colores.azul} />
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between items-center border-t pt-3 mt-1" style={{ borderColor: colorBordeHeader }}>
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase" style={{ backgroundColor: estado.bg, color: estado.color }}>
                      {estado.label}
                    </span>
                    <span className="text-[14px]" style={{ color: "black" }}>
                      {renderizarCantidad(item.cantidad, item.unidad)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      <ModalInfo
        visible={mostrarInfoNoEditable}
        mensaje={MENSAJE_INFO_NO_EDITABLE}
        onClose={() => setMostrarInfoNoEditable(false)}
      />
    </div>
  );
};

export default TablaInventario;
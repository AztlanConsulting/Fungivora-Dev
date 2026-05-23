import React from "react";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusMinus02Icon } from "@hugeicons/core-free-icons";

const colorBordeHeader = "#F2F2FC";
const columnasHeader = [
  { label: "Insumo", key: "nombre" },
  { label: "Cantidad Actual", key: "cantidad" },
  { label: "Estado", key: "estado" },
  { label: "Acciones", key: "accion" },
];

const TablaInventario = ({ insumos, loading, filaSeleccionada, setFilaSeleccionada, abrirModalEdicion, gridLayout }) => {

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
    const uniNormalizada = unidad ? unidad.trim().toLowerCase() : "";

    if ((uniNormalizada.startsWith("gramo") || uniNormalizada === "g") && num >= 1000) {
      return `${formatearNumero(num / 1000)} Kilogramo(s)`;
    }

    if ((uniNormalizada.startsWith("mililitro") || uniNormalizada === "ml") && num >= 1000) {
      return `${formatearNumero(num / 1000)} Litro(s)`;
    }
    return `${formatearNumero(num)} ${unidad}`;
  };

  // Estado por cantidad
  const obtenerEstado = (cantidad, recomendado) => {
    const cant = parseFloat(cantidad) || 0;
    const rec = parseFloat(recomendado) || 0;
    if (cant <= 0) return { label: "Agotado", color: "#EF4444", bg: "#FEE2E2" };
    if (cant <= rec * 0.5) return { label: "Bajo", color: "#F59E0B", bg: "#FEF3C7" };
    return { label: "Óptimo", color: "#10B981", bg: "#D1FAE5" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Text variante="medium">Cargando...</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
      {/* Header Desktop */}
      <div className={`hidden md:grid ${gridLayout} items-center min-h-[60px]`} style={{ backgroundColor: colorBordeHeader }}>
        {columnasHeader.map((col, i) => (
          <div key={i} className="px-6 flex items-center">
            <Text variante="medium" style={{ color: colores.azul, fontWeight: "600", fontSize: "16px", lineHeight: "4" }}>
              {col.label}
            </Text>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="h-auto max-h-[65vh] md:max-h-[550px] overflow-y-auto flex flex-col gap-4 md:gap-0">
        {insumos.map((item) => {
          const esSeleccionado = filaSeleccionada === item.id_insumo;
          const estado = obtenerEstado(item.cantidad, item.stock_recommended || item.stock_recomendado);

          return (
            <div key={item.id_insumo} onClick={() => setFilaSeleccionada(item.id_insumo)} className="group cursor-pointer">
              {/* Filas */}
              <div className={`hidden md:grid ${gridLayout} items-center border-b border-gray-50 hover:bg-gray-50 transition-colors`}>
                <div className="px-6 py-4">
                  <Text variante="option" style={{ color: "black", fontWeight: "600", fontSize: "15px" }}>{item.nombre}</Text>
                </div>
                <div className="px-8 py-4">
                  <Text variante="option" style={{ color: colores.black, fontWeight: "400", fontSize: "15px" }}>
                    {renderizarCantidad(item.cantidad, item.unidad)}
                  </Text>
                </div>
                <div className="px-8 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold inline-block" style={{ backgroundColor: estado.bg, color: estado.color }}>
                    {estado.label}
                  </span>
                </div>
                <div className="flex justify-center p-2" onClick={(e) => { e.stopPropagation(); abrirModalEdicion(item); }}>
                  <div className="hover:scale-110 transition-transform">
                    <HugeiconsIcon icon={PlusMinus02Icon} size={20} color={colores.azul} />
                  </div>
                </div>
              </div>

              {/* Cartas de movil*/}
              <div className="md:hidden mb-1">
                <div className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${esSeleccionado ? 'ring-2' : ''}`}
                  style={{ borderColor: colorBordeHeader, ringColor: colores.azul }}>
                  <div className="flex justify-between items-start mb-3">
                    <Text variante="option" style={{ color: "black", fontWeight: "600", fontSize: "16px" }}>{item.nombre}</Text>
                    <button onClick={(e) => { e.stopPropagation(); abrirModalEdicion(item); }}>
                      <HugeiconsIcon icon={PlusMinus02Icon} size={22} color={colores.azul} />
                    </button>
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
        })}
      </div>
    </div>
  );
};

export default TablaInventario;
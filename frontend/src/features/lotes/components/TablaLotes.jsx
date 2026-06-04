import React, { useState } from "react";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon, ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import BarraBusqueda from "../../../shared/components/ui/others/BarraBusqueda";
import normalizarBusqueda from "../../../shared/utils/normalizarBusqueda";
import { CustomCheckbox } from "../../../shared/components/ui/others/SeleccionarTodos";

const ITEMS_POR_PAGINA = 50;

const TablaLotes = ({ 
  datos, 
  columnas, 
  loading, 
  onVerDetalle, 
  obtenerEstiloFase, 
  gridLayout, 
  colorBordeHeader, 
  onEliminar,
  obtenerTodosLotes,
  onToggleTodosLotes
}) => {

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);


  // Filtrado de lotes original
  const lotesFiltrados = datos.filter((item) => {
    const codigo = normalizarBusqueda(item.codigo_fungivora);
    const ubicacion = normalizarBusqueda(item.ubicacion_lote);
    const estado = normalizarBusqueda(item.fase);
    const termino = normalizarBusqueda(busqueda);

    return codigo.includes(termino) || ubicacion.includes(termino) || estado.includes(termino);
  });

  // 2. Lógica de Paginación
  const totalItems = lotesFiltrados.length;
  const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA);
  
  // Cortar el array para mostrar solo los 50 de la página actual
  const indiceInicial = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const lotesPaginados = lotesFiltrados.slice(indiceInicial, indiceInicial + ITEMS_POR_PAGINA);

  // Eliminar el lote
  const handleEliminarClick = (e, lote) => {
    e.stopPropagation();
    onEliminar(lote);
  };

  return (
    <div className="flex flex-col md:justify-center md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
      
      {/* Barra de búsqueda y Checkbox Todo */}
      <div className="p-4 bg-white border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: colorBordeHeader }}>
        <div className="flex-1 max-w-md">
          <BarraBusqueda 
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
            setPaginaActual(1)
          }}
            placeholder="Buscar lote..."
          />
        </div>
        
        {/* Checkbox contenedor de "Marcar todos" */}
        <div className="flex items-center px-2">
          <CustomCheckbox
            checked={obtenerTodosLotes}
            onChange={onToggleTodosLotes}
            label="Mostrar todos los Lotes"
          />
        </div>
      </div>

      {/* Header */}
      <div className={`hidden min-[1200px]:grid ${gridLayout}`} style={{ backgroundColor: colorBordeHeader }}>
        {columnas.map((col, i) => (
          <div key={i} className="px-6 py-4 flex items-center justify-start">
            <Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>
              {col.label}
            </Text>
          </div>
        ))}
      </div>

      {/* Cuerpo de la tabla */}
      <div className="max-h-[455px] md:max-h-[305px] overflow-y-auto flex flex-col gap-3 md:gap-0">
        {loading ? (
          <div className="flex justify-center items-center h-[200px] w-full">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <Text variante="medium">Cargando datos de lotes...</Text>
            </div>
          </div>
        ) : lotesPaginados.length === 0 ? (
          <div className="text-center py-10 w-full">
            <Text variante="medium" style={{ color: colores.gris }}>
              {busqueda ? "No se encontraron lotes que coincidan." : "No hay lotes registrados."}
            </Text>
          </div>
        ) : (
          // MAPEAMOS lotesPaginados en lugar de lotesFiltrados
          lotesPaginados.map((lote) => {
            const estiloFase = obtenerEstiloFase(lote.fase);
            const fechaFormateada = new Date(lote.fecha_lote).toLocaleDateString();

            return (
              <div key={lote.id_lote} className="w-full">
                {/* Vista de desktop */}
                <div
                  onClick={() => onVerDetalle(lote)}
                  className={`hidden min-[1200px]:grid ${gridLayout} cursor-pointer transition-all border-b hover:bg-slate-50`}
                  style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}
                >
                  {columnas.map((col, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-start">
                      {col.key === 'fase' ? (
                        <div className="px-4 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                          {lote[col.key]}
                        </div>
                      ) : col.key === 'eliminar' ? (
                        <button
                          onClick={(e) => handleEliminarClick(e, lote)}
                          className="hover:scale-110 transition-transform p-2 flex items-center justify-center w-full"
                        >
                          <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                        </button>
                      ) : (
                        <Text variante="option" style={{ color: "black", fontSize: "15px", fontWeight: col.key === 'codigo_fungivora' ? '600' : '400' }}>
                          {col.key === 'fecha_lote' ? fechaFormateada : lote[col.key]}
                        </Text>
                      )}
                    </div>
                  ))}
                </div>

                {/* Vista de movil */}
                <div
                  onClick={() => onVerDetalle(lote)}
                  className="block min-[1200px]:hidden p-5 rounded-2xl border bg-white shadow-sm flex-col gap-4 cursor-pointer mb-4 mx-2"
                  style={{ borderColor: colorBordeHeader }}
                >
                  <div className="flex justify-between items-start">
                    <Text variante="option" style={{ color: "black", fontWeight: '500', fontSize: '18px' }}>{lote.codigo_fungivora}</Text>
                    <button onClick={(e) => handleEliminarClick(e, lote)}>
                      <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                    <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{lote.ubicacion_lote}</Text>
                    <div>
                      <span className="px-2 py-0.5 rounded-md text-[12px] font-semibold" style={{ backgroundColor: estiloFase.bg, color: estiloFase.text }}>
                        {lote.fase}
                      </span>
                    </div>
                    <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>{fechaFormateada}</Text>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Render Condicional de la Paginación (Solo si hay más de 50 datos en total) */}
      {totalItems > ITEMS_POR_PAGINA && (
        <div className="p-4 bg-white border-t flex items-center justify-between gap-2 select-none" style={{ borderColor: colorBordeHeader }}>
          <Text variante="option" style={{ color: colores.gris }}>
            {indiceInicial + 1} - {Math.min(indiceInicial + ITEMS_POR_PAGINA, totalItems)}
          </Text>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} color={colores.azul} />
            </button>
            
            <span className="px-3 py-1 bg-slate-100 rounded-md font-semibold text-sm">
              {paginaActual} / {totalPaginas}
            </span>

            <button
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={colores.azul} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaLotes;
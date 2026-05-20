import React, { useState } from "react";
import Text from "../../../shared/components/ui/basics/texto";
import { colores } from "../../../shared/components/ui/basics/colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';

const TablaUsuarios = ({ datos = [], esAdmin, colorBordeHeader, onEliminar }) => {
  // Paginacion
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Cálculos para obtener los datos de la página actual
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const usuariosActuales = datos.slice(indicePrimerElemento, indiceUltimoElemento);
  
  const totalPaginas = Math.ceil(datos.length / elementosPorPagina);

  const handleEliminarClick = (e, usuario) => {
    e.stopPropagation();
    onEliminar(usuario.id_usuario); 
  };

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
      
      {/* Header (Desktop) */}
      <div className={`hidden md:grid ${esAdmin ? 'grid-cols-3' : 'grid-cols-2'}`} style={{ backgroundColor: colorBordeHeader }}>
        <div className="px-6 py-4">
          <Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>Nombre de Usuario</Text>
        </div>
        <div className="px-6 py-4">
          <Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>Correo Electrónico</Text>
        </div>
        {esAdmin && (
          <div className="px-6 py-4 text-center">
            <Text variante="medium" style={{ color: colores.azul, fontSize: "16px", fontWeight: '600' }}>Acciones</Text>
          </div>
        )}
      </div>

      {/* Cuerpo de la tabla */}
      <div className="max-h-[605px] md:max-h-[550px] overflow-y-auto flex flex-col gap-3 md:gap-0">
        {usuariosActuales.length > 0 ? (
          usuariosActuales.map((usuario) => (
            <div key={usuario.id_usuario} className="w-full">
              
              {/* Fila Desktop */}
              <div
                className={`hidden md:grid ${esAdmin ? 'grid-cols-3' : 'grid-cols-2'} border-b hover:bg-slate-50`}
                style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}
              >
                <div className="px-6 py-5 flex items-center">
                  <Text variante="option" style={{ color: "black", fontSize: "15px", fontWeight: '400' }}>
                    {usuario.nombre_usuario}
                  </Text>
                </div>
                
                <div className="px-6 py-5 flex items-center">
                  <Text variante="option" style={{ color: "black", fontSize: "15px", fontWeight: '400' }}>
                    {usuario.correo_usuario} 
                  </Text>
                </div>

                {esAdmin && (
                  <div className="py-4 flex justify-center items-center">
                    <button 
                      onClick={(e) => handleEliminarClick(e, usuario)}
                      className="hover:scale-110 transition-transform p-2"
                      title="Eliminar Usuario"
                    >
                      <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                    </button>
                  </div>
                )}
              </div>

              {/* Tarjeta Mobile */}
              <div
                className="md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-4 mb-4 mx-2"
                style={{ borderColor: colorBordeHeader }}
              >
                <div className="flex justify-between items-start">
                    <Text variante="option" style={{ color: "black", fontWeight: '500', fontSize: '18px' }}>
                      {usuario.nombre_usuario}
                    </Text>
                    
                    {esAdmin && (
                      <button onClick={(e) => handleEliminarClick(e, usuario)}>
                          <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                      </button>
                    )}
                </div>
                <div className="border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                  <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>
                    {usuario.correo_usuario}
                  </Text>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">No hay usuarios para mostrar.</div>
        )}
      </div>

      {/* Controles de Paginación */}
      {totalPaginas > 1 && (
        <div 
          className="flex justify-between items-center px-6 py-4 bg-white border-t" 
          style={{ borderColor: colorBordeHeader }}
        >
          <button
            onClick={irPaginaAnterior}
            disabled={paginaActual === 1}
            className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            style={{ borderColor: colorBordeHeader, color: colores.azul }}
          >
            Anterior
          </button>
          
          <Text variante="option" style={{ color: colores.gris, fontSize: '14px' }}>
          {paginaActual} de {totalPaginas}
          </Text>

          <button
            onClick={irPaginaSiguiente}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            style={{ borderColor: colorBordeHeader, color: colores.azul }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default TablaUsuarios;
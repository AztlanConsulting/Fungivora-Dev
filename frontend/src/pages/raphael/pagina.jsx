import React, { useState } from "react";
import DiagramaRaphael from "./prueba";

const MiPagina = () => {
  // --- MOCK DATA ---
  const [familia] = useState(() => {
    const lista = [];
    for (let i = 1; i <= 50; i++) {
      let padreId = i === 1 ? null : i - 1;
      if (i === 25 || i === 26 || i === 27) padreId = 24; 
      if (i === 23 || i === 24) padreId = 22;
      if (i === 21 || i === 22) padreId = 20;

      lista.push({
        id: i,
        label: `Inóculo ${String(i).padStart(2, '0')}`,
        padreId: padreId, 
      });
    }
    return lista;
  });

  const [enfoqueId, setEnfoqueId] = useState(26);

  // --- LÓGICA CONSTRUCTORA AUTORESponsive ---
  const obtenerDatosArbol = (idRaiz) => {
    const nodos = [];
    const conexiones = [];

    const hijoPrincipal = familia.find((p) => p.id === idRaiz);
    if (!hijoPrincipal) return { arbolData: { nodos, conexiones }, anchoCanvas: 700 };

    const padreDirecto = hijoPrincipal.padreId ? familia.find((p) => p.id === hijoPrincipal.padreId) : null;
    const abueloDirecto = padreDirecto && padreDirecto.padreId ? familia.find((p) => p.id === padreDirecto.padreId) : null;

    // 1. Buscar Población de cada nivel colateral
    const nivelInferior = padreDirecto ? familia.filter((n) => n.padreId === padreDirecto.id) : [hijoPrincipal];
    const nivelMedio = padreDirecto ? (abueloDirecto ? familia.filter((n) => n.padreId === abueloDirecto.id) : [padreDirecto]) : [];
    const nivelSuperior = abueloDirecto ? (abueloDirecto.padreId ? familia.filter((n) => n.padreId === abueloDirecto.padreId) : [abueloDirecto]) : [];

    // 2. MATEMÁTICA DINÁMICA DE ANCHO
    // Buscamos cuál es el nivel que tiene más hermanos/cajas en pantalla
    const maxElementosEnUnNivel = Math.max(nivelInferior.length, nivelMedio.length, nivelSuperior.length, 1);
    const separacionX = 170; // Espaciado horizontal fijo por tarjeta
    
    // El ancho mínimo es 700px (para que se vea bien en PC), si hay muchos nodos crece de forma ilimitada
    const anchoCanvas = Math.max(maxElementosEnUnNivel * separacionX + 100, 700);
    const centroX = anchoCanvas / 2; // El centro se recalcula dinámicamente

    // Render Nivel Inferior
    nivelInferior.forEach((nodo, index) => {
      const offsetX = (index - (nivelInferior.length - 1) / 2) * separacionX;
      nodos.push({ ...nodo, x: centroX + offsetX, y: 360, tipo: "hijo" });
      if (nodo.padreId) conexiones.push({ from: nodo.id, to: nodo.padreId });
    });

    // Render Nivel Medio
    if (padreDirecto) {
      nivelMedio.forEach((nodo, index) => {
        const offsetX = (index - (nivelMedio.length - 1) / 2) * separacionX;
        nodos.push({ ...nodo, x: centroX + offsetX, y: 210, tipo: "padre" });
        if (nodo.padreId) conexiones.push({ from: nodo.id, to: nodo.padreId });
      });
    }

    // Render Nivel Superior
    if (abueloDirecto) {
      nivelSuperior.forEach((nodo, index) => {
        const offsetX = (index - (nivelSuperior.length - 1) / 2) * separacionX;
        nodos.push({ ...nodo, x: centroX + offsetX, y: 60, tipo: "abuelo" });
      });
    }

    return { arbolData: { nodos, conexiones }, anchoCanvas };
  };

  const { arbolData, anchoCanvas } = obtenerDatosArbol(enfoqueId);
  const nodoEnfocado = familia.find((n) => n.id === enfoqueId);
  const hijosDisponibles = familia.filter((n) => n.padreId === enfoqueId);

  return (
    <div className="flex flex-col lg:flex-row p-4 lg:p-8 gap-6 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* DIAGRAMA PRINCIPAL */}
      <div className="w-full lg:w-3/4 flex flex-col gap-4">
        <div className="bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Árbol de Genealogía y Linaje</h1>
              <p className="text-xs text-slate-500">Representación fluida autoadaptable</p>
            </div>
            <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700 self-start">
              Enfoque: {nodoEnfocado?.label}
            </div>
          </div>

          {/* CONTENEDOR MÓVIL AUTO SCROLLABLE */}
          <div className="w-full overflow-x-auto pb-2 rounded-xl bg-slate-50/50 border border-slate-100 scrollbar-thin">
            <DiagramaRaphael datos={arbolData} anchoCanvas={anchoCanvas} onNodoClick={setEnfoqueId} />
          </div>
          
          <div className="mt-2 text-center text-[11px] text-slate-400 block lg:hidden">
            ⬅️ Desliza horizontalmente para explorar las ramas ➡️
          </div>
        </div>
      </div>

      {/* PANEL LATERAL */}
      <div className="w-full lg:w-1/4 flex flex-col gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wide">
            Buscar Lote Global
          </label>
          <select 
            className="w-full text-sm p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium"
            value={enfoqueId}
            onChange={(e) => setEnfoqueId(Number(e.target.value))}
          >
            {familia.map(n => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Siguiente Generación (Hijos)
          </h3>
          {hijosDisponibles.length > 0 ? (
            <div className="space-y-2">
              {hijosDisponibles.map((hijo) => (
                <div 
                  key={hijo.id} 
                  onClick={() => setEnfoqueId(hijo.id)}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer transition-all group"
                >
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-900">{hijo.label}</span>
                  <span className="text-[10px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver ↓</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-center">
              Lote terminal (Sin descendencia).
            </p>
          )}
        </div>
      </div>

    </div>
  );
};

export default MiPagina;
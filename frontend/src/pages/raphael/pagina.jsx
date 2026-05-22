import React, { useState } from "react";
import DiagramaRaphael from "./prueba";

const MiPagina = () => {
  const [familia, setFamilia] = useState([
    { id: 1, label: "Lote Inicial L-01", padres: [], tipo: 'hijo' }
  ]);
  const [enfoqueId, setEnfoqueId] = useState(1);
  const [nuevoNombre, setNuevoNombre] = useState("");

  // --- ACCIONES DE LA LISTA ---

  const crearNuevoNodo = (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;
    const nuevo = {
      id: Date.now(),
      label: nuevoNombre,
      padres: [],
      tipo: 'hijo'
    };
    setFamilia([...familia, nuevo]);
    setNuevoNombre("");
  };

  const eliminarNodo = (id) => {
    if (familia.length <= 1) return;
    setFamilia(familia.filter(n => n.id !== id));
    if (enfoqueId === id) setEnfoqueId(familia[0].id);
  };

  const asignarPadre = (hijoId, padreId) => {
    if (hijoId === padreId) return;
    setFamilia(prev => prev.map(nodo => {
      if (nodo.id === hijoId) {
        // Evitar duplicados y máximo 2 padres
        const nuevosPadres = [...new Set([...nodo.padres, padreId])].slice(0, 2);
        return { ...nodo, padres: nuevosPadres };
      }
      return nodo;
    }));
  };

  // --- LÓGICA DE CONSTRUCCIÓN DEL ÁRBOL ---
  const construirArbol = (idRaiz) => {
    const nodos = [];
    const conexiones = [];
    const hijo = familia.find(p => p.id === idRaiz);
    if (!hijo) return { nodos, conexiones };

    nodos.push({ ...hijo, x: 350, y: 350, tipo: 'hijo' });

    hijo.padres.forEach((pId, index) => {
      const padre = familia.find(p => p.id === pId);
      if (padre) {
        const xPos = index === 0 ? 175 : 525;
        nodos.push({ ...padre, x: xPos, y: 200, tipo: 'padre' });
        conexiones.push({ from: hijo.id, to: padre.id });

        padre.padres.forEach((aId, aIndex) => {
          const abuelo = familia.find(p => p.id === aId);
          if (abuelo) {
            const xAbuelo = index === 0 ? (aIndex === 0 ? 100 : 250) : (aIndex === 0 ? 450 : 600);
            nodos.push({ ...abuelo, x: xAbuelo, y: 50, tipo: 'abuelo' });
            conexiones.push({ from: padre.id, to: abuelo.id });
          }
        });
      }
    });
    return { nodos, conexiones };
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-6 bg-slate-50 min-h-screen">
      
      {/* PANEL IZQUIERDO: LISTA DE GESTIÓN */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 overflow-y-auto max-h-screen">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Gestión de Inóculos</h2>
        
        {/* Formulario para añadir */}
        <form onSubmit={crearNuevoNodo} className="mb-6 flex gap-2">
          <input 
            type="text" 
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            placeholder="Nombre del lote..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+</button>
        </form>

        {/* Lista de Nodos */}
        <div className="space-y-4">
          {familia.map(nodo => (
            <div key={nodo.id} className={`p-4 rounded-xl border ${enfoqueId === nodo.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700">{nodo.label}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEnfoqueId(nodo.id)} className="text-xs bg-white px-2 py-1 rounded shadow-sm">Enfocar</button>
                  <button onClick={() => eliminarNodo(nodo.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">Eliminar</button>
                </div>
              </div>

              {/* Selector de Padres */}
              <div className="mt-3">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Asignar Ancestros (Máx 2):</p>
                <select 
                  className="w-full text-xs p-1 rounded border bg-white"
                  onChange={(e) => asignarPadre(nodo.id, parseInt(e.target.value))}
                  defaultValue=""
                >
                  <option value="" disabled>Seleccionar inóculo existente...</option>
                  {familia.filter(f => f.id !== nodo.id).map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
                <div className="flex gap-1 mt-2">
                  {nodo.padres.map(pId => (
                    <span key={pId} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {familia.find(f => f.id === pId)?.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL DERECHO: DIAGRAMA */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 sticky top-6">
          <div className="flex justify-between mb-4 px-4">
            <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Vista de Linaje</h3>
            <span className="text-xs text-indigo-600 font-bold">Enfoque: {familia.find(f => f.id === enfoqueId)?.label}</span>
          </div>
          <DiagramaRaphael datos={construirArbol(enfoqueId)} onNodoClick={setEnfoqueId} />
        </div>
      </div>

    </div>
  );
};

export default MiPagina;
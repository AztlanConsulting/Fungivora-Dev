import React from "react";
import DiagramaRaphael from "./prueba"; 

const MiPagina = () => {
  const misDatos = {
    nodos: [
      { id: 1, x: 100, y: 100, label: "Lote 001" },
      { id: 2, x: 300, y: 100, label: "Inoculación" },
      { id: 3, x: 300, y: 250, label: "Colonización" }
    ],
    conexiones: [
      { from: 1, to: 2 },
      { from: 2, to: 3 }
    ]
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Mi Diagrama de Cultivo</h1>
      <div className="max-w-4xl mx-auto">
        <DiagramaRaphael datos={misDatos} />
      </div>
    </div>
  );
};

export default MiPagina;
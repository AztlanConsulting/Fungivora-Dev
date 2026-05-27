import React from "react";

// 1. Nombre con Mayúscula
const AlertaError = ({ detalle, esExito = false }) => {
  if (!detalle) return null;

  // Cambiamos los colores dinámicamente
  const estilos = esExito 
    ? "bg-green-50 border-green-500 text-green-700" 
    : "bg-red-50 border-red-500 text-red-700";

  return (
    <div className={`mb-6 p-4 border-l-4 rounded-r-lg shadow-sm animate-fade-in w-full ${estilos}`}>
      <p className="font-bold">{esExito ? "Operación Exitosa" : "Error de Validación"}</p>
      <p className="text-sm">{detalle}</p>
    </div>
  );
};

export default AlertaError;
import React from 'react';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';

const BannerIngredientes = ({ ingredientes }) => {
    // Debug: mira qué llega realmente
    console.log("Ingredientes recibidos:", ingredientes);

    // Si ingredientes no es un array, no intentes hacer .map()
    if (!Array.isArray(ingredientes)) {
        return <div className="p-4">Error: Los datos no tienen el formato esperado.</div>;
    }

    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            {/* ... resto del código ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredientes.map((ing, index) => {
                    // Verificación de seguridad dentro del map
                    if (!ing || typeof ing !== 'object') return null;

                    return (
                        <div key={ing.id_insumo || index} className="flex justify-between p-3 bg-gray-50 rounded-xl">
                            <span className="font-medium text-gray-800">{ing.nombre || 'Sin nombre'}</span>
                            <span className="text-gray-600">{ing.cantidad || 0} {ing.unidad || ''}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BannerIngredientes;
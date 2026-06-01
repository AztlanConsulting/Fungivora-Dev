import React from 'react';
import { LeafIcon, Layers01Icon, Calendar03Icon, Package03Icon } from '@hugeicons/core-free-icons';
import InfoLote from '../../lotes/components/InfoLote'; // Puedes reutilizar el mismo componente de info

const BannerInoculoInfo = ({ data }) => {
    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-wrap gap-6">
            <InfoLote icon={Calendar03Icon} label="Fecha" value={new Date(data.fecha).toLocaleDateString('es-MX')} />
            <InfoLote icon={LeafIcon} label="Especie" value={data.especie} />
            <InfoLote icon={Layers01Icon} label="Tipo" value={data.tipo} />
            <InfoLote icon={Package03Icon} label="Stock Disponible" value={`${data.cantidad_disponible} ${data.unidad}`} />
        </div>
    );
};

export default BannerInoculoInfo;
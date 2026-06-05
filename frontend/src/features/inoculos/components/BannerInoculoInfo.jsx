import React from 'react';
import { Calendar03Icon, Plant01Icon, MushroomIcon, PackageDelivered01Icon, DeliveryView01Icon } from '@hugeicons/core-free-icons';
import InfoLote from '../../lotes/components/InfoLote';
import { Link } from 'react-router-dom';

const BannerInoculoInfo = ({ data }) => {
    const fechaFormateada = new Date(data.fecha).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-wrap gap-6">
            <InfoLote icon={Calendar03Icon} label="Fecha" value={fechaFormateada} />
            <InfoLote icon={MushroomIcon} label="Especie" value={data.especie} />
            <InfoLote icon={DeliveryView01Icon} label="Cantidad Actual" value={`${data.cantidad_disponible} ${data.unidad}`} />
            <InfoLote icon={PackageDelivered01Icon} label="Stock Recomendado" value={`${data.stock_recomendado || 0} ${data.unidad}`} />
            
            {data.id_inoculo_usado ? (
                <Link
                    to={`/inoculos/detalle/${data.id_inoculo_usado}`}
                    className="group transition-all duration-200 flex items-center rounded-xl hover:bg-green-100"
                >
                    <InfoLote
                        icon={Plant01Icon}
                        label="Inóculo"
                        value={data.nombre_inoculo_usado}
                    />
                </Link>
            ) : (
                <InfoLote icon={Plant01Icon} label="Inóculo" value="Comprado" />
            )}
        </div>
    );
};

export default BannerInoculoInfo;
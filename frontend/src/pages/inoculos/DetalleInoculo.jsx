import React from 'react';
import { useParams } from 'react-router-dom';
import useDetalleInoculo from '../../features/inoculos/hooks/useDetalleInoculo'
import BannerIngredientes from '../../features/inoculos/components/BannerIngredientes';
import BannerInoculoInfo from '../../features/inoculos/components/BannerInoculoInfo';
import { Titulo } from '../../shared/components/ui';
import { Base } from '../../shared/components/layout';

const DetalleInoculo = () => {
    const { id_inoculo } = useParams();
    const { inoculo, ingredientes, cargando, error } = useDetalleInoculo(id_inoculo);

    // Reemplazo del Spinner por un mensaje simple
    if (cargando) return (
        <div className="p-6 text-center">
            <p className="text-gray-500">Cargando detalles del inóculo...</p>
        </div>
    );
    
    if (error) return <div className="text-red-500 p-6">Error: {error}</div>;
    if (!inoculo) return <div className="p-6">No se encontró el inóculo.</div>;

    return (
        <Base margen_arriba="mt-16 md:mt-8">
            <div className="p-6 flex flex-col gap-8">
                {/* Título Principal */}
                <Titulo>Inóculo: {inoculo.codigo_fungivora}</Titulo>

                {/* Banner 1: Información Técnica */}
                <BannerInoculoInfo data={inoculo} />

                {/* Banner 2: Ingredientes */}
                <BannerIngredientes ingredientes={ingredientes} />
            </div>
        </Base>
    );
};

export default DetalleInoculo;
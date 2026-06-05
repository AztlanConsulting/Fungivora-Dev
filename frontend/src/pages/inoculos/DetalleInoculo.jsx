import React from 'react';
import { useParams } from 'react-router-dom';
import useDetalleInoculo from '../../features/inoculos/hooks/useDetalleInoculo'
import BannerIngredientes from '../../features/inoculos/components/BannerIngredientes';
import BannerInoculoInfo from '../../features/inoculos/components/BannerInoculoInfo';
import NotasInoculo from '../../features/inoculos/components/NotasInoculo';
import { Titulo } from '../../shared/components/ui';
import { Base } from '../../shared/components/layout';
import { Text } from '../../shared/components/ui';

const DetalleInoculo = () => {
    const { id_inoculo } = useParams();
    const { inoculo, ingredientes, cargando, error } = useDetalleInoculo(id_inoculo);

    if (cargando) return (
        <div className="flex justify-center items-center h-[200px] w-full">
            <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <Text variante="medium">Cargando datos de inóculo...</Text>
            </div>
        </div>
    );
    
    if (error) return(
        <div className="flex justify-center items-center h-[200px] w-full">
            <Text variante="medium p-6" style={{ color: "red", fontWeight: '500', fontSize: '22px' }}> Error de conexión</Text>
        </div> );
    if (!inoculo) return <div className="p-6">No se encontró el inóculo.</div>;

    return (
        <Base margen_arriba="mt-16 md:mt-8">
            <div className="p-6 flex flex-col gap-8">
                {/* Título*/}
                <Titulo>Inóculo: {inoculo.codigo_fungivora}</Titulo>

                {/* Banner 1: Información Técnica */}
                <BannerInoculoInfo data={inoculo} />

                {/* Banner 2: Ingredientes */}
                <BannerIngredientes ingredientes={ingredientes} inoculo={inoculo} />

                {/* Notas inóculo */}
                <NotasInoculo id_inoculo={id_inoculo} />
            </div>
        </Base>
    );
};

export default DetalleInoculo;
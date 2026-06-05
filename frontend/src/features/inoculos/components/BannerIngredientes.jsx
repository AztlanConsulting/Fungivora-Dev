import React from 'react';
import Text from '../../../shared/components/ui/basics/Texto';

const BannerIngredientes = ({ ingredientes, inoculo }) => {
    if (!inoculo) return null;

    const tieneInoculoMadre = inoculo.id_inoculo_usado != null;
    const items = [];
    
    if (tieneInoculoMadre) {
        items.push({
            nombre: `Inóculo`,
            cantidad: inoculo.cantidad_usada,
            unidad: ''
        });
    }

    const listaCompleta = [...ingredientes, ...items];

    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-wrap items-center w-full gap-4">
                <div className="px-4 py-2 min-w-max">
                    <Text variante="option" style={{ color: '#1A1A40', fontSize: '18px' }}>
                        Composición:
                    </Text>
                </div>

                <div className="hidden min-[1300px]:block h-10 w-[1px] bg-gray-100" />

                {listaCompleta.length === 0 ? (
                    <div className="px-4 py-2">
                        <Text variante="body" style={{ color: '#666' }}>Comprado</Text>
                    </div>
                ) : (
                    listaCompleta.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center w-full min-[1300px]:w-auto min-[1300px]:flex-1 min-w-0 px-4 py-2"
                        >
                            <div className="flex flex-col min-w-0">
                                <Text variante="body" style={{ color: '#666', fontSize: '13px', wordBreak: 'break-word' }}>
                                    {item.nombre}
                                </Text>
                                <Text variante="option" style={{ color: '#1A1A40', fontSize: '15px', wordBreak: 'break-word' }}>
                                    {item.cantidad} {item.unidad}
                                </Text>
                            </div>

                            {index < listaCompleta.length - 1 && (
                                <div className="hidden min-[1300px]:block h-10 w-[1px] bg-gray-100 ml-auto" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BannerIngredientes;
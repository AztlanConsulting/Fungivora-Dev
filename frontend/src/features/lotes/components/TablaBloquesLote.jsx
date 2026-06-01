import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import Text from '../../../shared/components/ui/basics/Texto';
import { colores } from '../../../shared/components/ui/basics/Colores';

const colorHeaderTabla = '#F2F2FC';
const colorBordeDestacado = '#7F7FD5';

const TablaBloques = ({ bloques = [], loading = false, onToggleContaminado }) => {

    const gridLayoutBloques = "md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1.1fr_100px]";

    const formatearPeso = (gramos) => {
        const pesoNum = parseFloat(gramos || 0);
        if (pesoNum >= 1000) {
            const kg = (pesoNum / 1000).toFixed(1).replace(/\.0$/, "");
            return `${kg} Kilogramos(s)`;
        }
        return `${pesoNum.toFixed(0)} Gramos(s)`;
    };

    const bloquesOrdenados = [...bloques].sort((a, b) => {
        const inoculoA = (a.codigo_inoculo_bloque || '').toString();
        const inoculoB = (b.codigo_inoculo_bloque || '').toString();
        const comparacionInoculo = inoculoA.localeCompare(inoculoB);

        if (comparacionInoculo !== 0) return comparacionInoculo;
        
        const comparacionProduccion = b.produccion - a.produccion;
        if (comparacionProduccion !== 0) return comparacionProduccion;

        const sustratoA = (a.tipo_sustrato || '').toString();
        const sustratoB = (b.tipo_sustrato || '').toString();
        return sustratoA.localeCompare(sustratoB);
    });

    const renderEtiqueta = (esProduccion) => {
        const esProd = esProduccion === 1 || esProduccion === true;
        const bg = esProd ? '#E6F6F1' : '#EBEBFF';
        const color = esProd ? '#2D9171' : '#4D4DFF';
        const texto = esProd ? 'Producción' : 'Experimental';

        return (
            <div className="px-4 py-1 rounded-lg inline-block" style={{ backgroundColor: bg }}>
                <Text variante="body" style={{ color, fontWeight: '600', fontSize: '12px' }}>
                    {texto}
                </Text>
            </div>
        );
    };

    const renderCheckbox = (isChecked, id_bloque) => (
        <label className="relative flex items-center justify-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isChecked === 1 || isChecked === true}
                onChange={() => onToggleContaminado && onToggleContaminado(id_bloque)}
            />
            <div
                className="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all peer-checked:bg-white"
                style={{
                    borderColor: (isChecked === 1 || isChecked === true) ? colorBordeDestacado : '#D1D1D1',
                }}
            >
                {(isChecked === 1 || isChecked === true) && (
                    <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={3} color={colorBordeDestacado} />
                )}
            </div>
        </label>
    );

    return (
        <div className="w-full rounded-[32px] border shadow-sm p-4 md:p-6" style={{ backgroundColor: colores.blanco, borderColor: '#E0E0E0' }}>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#F0F0F0' }}>

                {/* Header */}
                <div className={`hidden md:grid ${gridLayoutBloques} py-5 px-8 gap-4`} style={{ backgroundColor: colorHeaderTabla }}>
                    {["Código Bloque", "Inóculo", "Sustrato", "Tamaño", "Peso", "Clasificación"].map((label) => (
                        <div key={label} className="flex items-center justify-start h-full">
                            <Text variante="option" style={{ fontWeight: '600' }}>{label}</Text>
                        </div>
                    ))}
                    <div className="flex items-center justify-center h-full">
                        <Text variante="option" style={{ fontWeight: '600' }}>Contaminado</Text>
                    </div>
                </div>

                <div className="flex flex-col">
                    {loading ? (
                        <div className="flex justify-center items-center h-[200px] w-full">
                            <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <Text variante="medium">Cargando datos de bloques...</Text>
                            </div>
                        </div>
                    ) : bloquesOrdenados.length === 0 ? (
                        <div className="p-10 text-center bg-white">
                            <Text variante="body" style={{ color: colores.gris }}>Sin bloques registrados.</Text>
                        </div>
                    ) : (
                        bloquesOrdenados.map((bloque, index) => {
                            const codigoInoculo = bloque.codigo_inoculo_bloque; 
                            const codigoVisual = bloque.codigo_visual;

                            return (
                                <div key={bloque.id_bloque || index} className="relative">
                                    {/* Vista móvil */}
                                    <div className="md:hidden p-5 flex flex-col gap-4 bg-white border-b border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <Text variante="body" style={{ fontWeight: '600' }}>{codigoVisual}</Text>
                                                <Text variante="body" style={{ fontWeight: '400', fontSize: '13px', color: '#666' }}>
                                                    {codigoInoculo || 'S/N'}
                                                </Text>
                                            </div>
                                            {renderCheckbox(bloque.contaminado, bloque.id_bloque)}
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col gap-1">
                                                <Text variante="body" style={{ color: '#444', fontSize: '13px' }}>
                                                    {bloque.contenedor} <span className="text-gray-500 mx-1"></span> <span className="text-gray-500 font-medium">{bloque.tipo_sustrato}</span>
                                                </Text>
                                                <Text variante="body" style={{ color: '#444', fontSize: '13px', fontWeight: '500' }}>
                                                    {formatearPeso(bloque.peso_gr)}
                                                </Text>
                                            </div>
                                            <div>{renderEtiqueta(bloque.produccion)}</div>
                                        </div>
                                    </div>

                                    {/* Vista desktop */}
                                    <div className={`hidden md:grid ${gridLayoutBloques} px-8 py-4 gap-4 items-center transition-colors hover:bg-slate-50 bg-white`}
                                        style={{ borderBottom: index === bloquesOrdenados.length - 1 ? 'none' : '1px solid #F0F0F0' }}>
                                        
                                        <div className="flex items-center justify-start truncate min-w-0"><Text variante="body" style={{ fontWeight: '600' }}>{codigoVisual}</Text></div>
                                        <div className="flex items-center justify-start truncate min-w-0"><Text variante="body" style={{ fontWeight: '400', color: '#666', fontSize: '15px' }}>{codigoInoculo || 'S/N'}</Text></div>
                                        <div className="flex items-center justify-start truncate min-w-0"><Text variante="body" style={{ color: '#444', fontSize: '15px' }}>{bloque.tipo_sustrato}</Text></div>
                                        <div className="flex items-center justify-start truncate min-w-0"><Text variante="body" style={{ color: '#444' }}>{bloque.contenedor}</Text></div>
                                        <div className="flex items-center justify-start truncate min-w-0"><Text variante="body" style={{ color: '#444' }}>{formatearPeso(bloque.peso_gr)}</Text></div>
                                        <div className="flex items-center justify-start"><div className="truncate">{renderEtiqueta(bloque.produccion)}</div></div>
                                        <div className="flex items-center justify-center">{renderCheckbox(bloque.contaminado, bloque.id_bloque)}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default TablaBloques;
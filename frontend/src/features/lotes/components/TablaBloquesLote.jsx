import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import Text from '../../../shared/components/ui/basics/Texto';
import { colores } from '../../../shared/components/ui/basics/Colores';

const colorHeaderTabla = '#F2F2FC';
const colorBordeDestacado = '#7F7FD5';

const TablaBloques = ({ bloques = [], loading = false, onToggleContaminado, codigo_lote }) => {

    // Generar unicamente de modo vizual el código para el bloque
    const generarCodigoBloque = (codigoLote, indice) => {
        if (!codigoLote) return `BC-B${indice + 1}`;

        let base = codigoLote.trim();

        const partes = base.split('-');
        if (partes.length > 3) {
            partes.pop();
            base = partes.join('-');
        }

        if (base.toUpperCase().startsWith('LC')) {
            base = 'BC' + base.substring(2);
        } else if (!base.toUpperCase().startsWith('BC')) {
            base = 'BC-' + base;
        }

        return `${base}-${indice + 1}`;
    };

    const renderEtiqueta = (esProduccion) => {
        const esProd = esProduccion === 1 || esProduccion === true;
        const bg = esProd ? '#E6F6F1' : '#EBEBFF';
        const color = esProd ? '#2D9171' : '#4D4DFF';
        const texto = esProd ? 'Producción' : 'Experimental';

        return (
            <div className="px-4 py-1 rounded-lg inline-block" style={{ backgroundColor: bg }}>
                <Text variante="body" style={{ color, fontWeight: '600', fontSize: '14px' }}>
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

                {/* Encabezado Desktop */}
                <div className="hidden md:grid grid-cols-5 py-5 px-8 gap-4 items-center" style={{ backgroundColor: colorHeaderTabla }}>
                    <div><Text variante="option" style={{ fontWeight: '600' }}>Código del bloque</Text></div>
                    <div><Text variante="option" style={{ fontWeight: '600' }}>Tamaño</Text></div>
                    <div><Text variante="option" style={{ fontWeight: '600' }}>Peso (g)</Text></div>
                    <div><Text variante="option" style={{ fontWeight: '600' }}>Clasificación</Text></div>
                    <div><Text variante="option" style={{ fontWeight: '600' }}>Contaminado</Text></div>
                </div>

                <div className="flex flex-col">
                    {loading ? (
                        <div className="p-10 text-center"><Text variante="body">Cargando bloques...</Text></div>
                    ) : bloques.length === 0 ? (
                        <div className="p-10 text-center bg-white">
                            <Text variante="body" style={{ color: colores.gris }}>Sin bloques registrados.</Text>
                        </div>
                    ) : (
                        bloques.map((bloque, index) => {
                            // Inserta el código vizual
                            const codigoVisual = generarCodigoBloque(codigo_lote, index);
                            const pesoLimpio = parseFloat(bloque.peso_gr || 0).toFixed(0);

                            return (
                                <div key={bloque.id_bloque || index} className="relative">
                                    {/* Vista movil */}
                                    <div className="md:hidden p-5 flex flex-col gap-2 bg-white border-b border-gray-100">
                                        <Text variante="body" style={{ fontWeight: '600', color: colores.azul }}>
                                            {codigoVisual}
                                        </Text>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="flex flex-col">
                                                <Text variante="body" style={{ color: colores.gris }}>{bloque.contenedor}</Text>
                                                <Text variante="body" style={{ color: colores.gris }}>{pesoLimpio} g</Text>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {renderEtiqueta(bloque.produccion)}
                                                <div className="flex items-center gap-2">
                                                    <Text variante="body" style={{ fontSize: '12px' }}>Contaminado:</Text>
                                                    {renderCheckbox(bloque.contaminado, bloque.id_bloque)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vista desktop */}
                                    <div className="hidden md:grid grid-cols-5 px-8 py-4 gap-4 items-center transition-colors hover:bg-slate-50 bg-white"
                                        style={{ borderBottom: index === bloques.length - 1 ? 'none' : '1px solid #F0F0F0' }}>
                                        <Text variante="body" style={{ fontWeight: '600', color: '#1A1A40' }}>{codigoVisual}</Text>
                                        <Text variante="body" style={{ color: '#444' }}>{bloque.contenedor}</Text>
                                        <Text variante="body" style={{ color: '#444' }}>{pesoLimpio} g</Text>
                                        <div>{renderEtiqueta(bloque.produccion)}</div>
                                        <div className="flex justify-start">
                                            {renderCheckbox(bloque.contaminado, bloque.id_bloque)}
                                        </div>
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
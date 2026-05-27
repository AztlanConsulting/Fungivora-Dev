import React, { useMemo } from 'react'; 
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';

import Text from '../../../shared/components/ui/basics/Texto';
import SelectField from '../../../shared/components/ui/inputs/SeleccionarTexto';
import { colores } from '../../../shared/components/ui/basics/Colores';

import useInoculoCard from '../hooks/useInoculoCard';
import { TIPOS_INOCULO } from '../types/inoculo.types';

const colorHeaderTabla = '#F2F2FC';

const COLUMNAS = [
    { key: 'codigo_fungivora', label: 'Etiqueta' },
    { key: 'cantidad_disponible', label: 'Cantidad actual', render: (f) => `${f.cantidad_disponible} ${f.unidad}` },
    { key: 'stock_recomendado', label: 'Stock recomendado' },
    { key: 'fecha', label: 'Fecha Creación', render: (f) => formatFecha(f.fecha) },
];

const ABREVIACIONES = {
    'Agar': 'Agar',
    'Medio Líquido': 'Medio L.',
    'Semilla': 'Semilla'
};

const formatFecha = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

/**
 * Card de especie con select de tipo de inóculo y tabla colapsable de datos.
 * @param {{ especie: import('../types/inoculo.types').Especie }} props
 */
const InoculoCard = ({ especie }) => {
    const {
        tipoSeleccionado,
        datos,
        loading,
        error,
        collapsed,
        isMobile,
        handleTipoChange,
        toggleCollapse,
    } = useInoculoCard(especie.value);

    const datosOrdenados = useMemo(() => {
        if (!datos) return [];
        
        return [...datos]
            .filter((fila) => Number(fila.cantidad_disponible) > 0)
            .sort((a, b) => {
                const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
                const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;

                if (fechaB !== fechaA) {
                    return fechaB - fechaA; 
                }

                const obtenerPrefijo = (codigo) => {
                    if (!codigo) return '';
                    const partes = codigo.split('-');
                    return partes.slice(0, -1).join('-'); 
                };

                const prefijoA = obtenerPrefijo(a.codigo_fungivora);
                const prefijoB = obtenerPrefijo(b.codigo_fungivora);

                if (prefijoA !== prefijoB) {
                    return prefijoA.localeCompare(prefijoB); 
                }

                const extraerNumero = (codigo) => {
                    if (!codigo) return 0;
                    const partes = codigo.split('-');
                    const ultimoSegmento = partes[partes.length - 1];
                    const numero = parseInt(ultimoSegmento, 10);
                    return isNaN(numero) ? 0 : numero;
                };

                const numA = extraerNumero(a.codigo_fungivora);
                const numB = extraerNumero(b.codigo_fungivora);

                return numA - numB; 
            });
    }, [datos]);

    const opcionesAbreviadas = TIPOS_INOCULO.map((tipo) => ({
        value: tipo.value,
        label: ABREVIACIONES[tipo.label] || tipo.label
    }));

    return (
        <div
            className="w-full rounded-2xl border overflow-hidden"
            style={{ borderColor: colorHeaderTabla, backgroundColor: colores.blanco }}
        >
            {/* ── Cabecera de la card ── */}
            <div className="flex items-center justify-between px-4 py-4 md:px-6">
                <button
                    onClick={toggleCollapse}
                    aria-label={collapsed ? 'Expandir' : 'Colapsar'}
                    className="flex items-center gap-2 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
                >
                    <Text variante="option" style={{ fontSize: 'clamp(18px, 6vw, 28px)' }}>{especie.label}</Text>
                    <HugeiconsIcon
                        icon={collapsed ? ArrowDown01Icon : ArrowUp01Icon}
                        size={20}
                        color={colores.azul}
                    />
                </button>

                {!collapsed && (
                    <SelectField
                        value={tipoSeleccionado}
                        onChange={(e) => handleTipoChange(e.target.value)}
                        options={isMobile ? opcionesAbreviadas : TIPOS_INOCULO}
                        size={isMobile ? 'numero' : 'amplio'}
                        placeholder="Tipo"
                    />
                )}
            </div>

            {/* ── Cuerpo colapsable ── */}
            {!collapsed && (
                <div
                    className="mx-4 mb-4 md:mx-6 md:mb-6 rounded-xl border overflow-hidden"
                    style={{ borderColor: colorHeaderTabla }}
                >
                    {/* Estado: cargando / error */}
                    {(loading || error) && (
                        <div className="px-4 py-6 text-center">
                            <Text variante="body" style={{ color: loading ? colores.gris : 'red', fontStyle: 'italic' }}>
                                {loading ? 'Cargando...' : error}
                            </Text>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Encabezado de tabla  */}
                            <div
                                className="hidden md:grid md:grid-cols-4"
                                style={{ backgroundColor: colorHeaderTabla }}
                            >
                                {COLUMNAS.map((col) => (
                                    <div key={col.key} className="px-6 py-3">
                                        <Text variante="option">{col.label}</Text>
                                    </div>
                                ))}
                            </div>

                            {/* Sin resultados */}
                            {datosOrdenados.length === 0 && (
                                <div className="px-4 py-8 text-center bg-white">
                                    <Text variante="body" style={{ color: colores.gris }}>
                                        Sin registros para este tipo.
                                    </Text>
                                </div>
                            )}

                            {/* Filas basadas en datosOrdenados */}
                            {datosOrdenados.map((fila, index) => (
                                <div
                                    key={fila.id_inoculo}
                                    className="bg-white"
                                    style={{
                                        borderBottom:
                                            index === datosOrdenados.length - 1
                                                ? 'none'
                                                : `1px solid ${colorHeaderTabla}`,
                                    }}
                                >
                                    {/* Móvil: apilado */}
                                    <div className="md:hidden px-4 py-3 flex flex-col gap-1">
                                        <Text variante="option" style={{ color: colores.azul }}>
                                            {fila.codigo_fungivora}
                                        </Text>
                                        <div className="flex gap-6 mt-1 flex-wrap">
                                            <Text variante="body" style={{ color: colores.gris }}>
                                                {fila.cantidad_disponible} {fila.unidad}
                                            </Text>
                                            <Text variante="body" style={{ color: colores.gris }}>
                                                Mín. {fila.stock_recomendado}
                                            </Text>
                                            <Text variante="body" style={{ color: colores.gris }}>
                                                {formatFecha(fila.fecha)}
                                            </Text>
                                        </div>
                                    </div>

                                    {/* Desktop: columnas */}
                                    <div className="hidden md:grid md:grid-cols-4">
                                        {COLUMNAS.map((col) => (
                                            <div key={col.key} className="px-6 py-4">
                                                <Text variante="body" style={{ color: colores.gris, fontStyle: 'italic' }}>
                                                    {col.render ? col.render(fila) : fila[col.key]}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default InoculoCard;
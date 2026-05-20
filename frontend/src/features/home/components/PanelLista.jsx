import React from 'react';
import { Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/colores';
import FilaCheck from './FilaCheck';

const PanelLista = ({
    icono,
    titulo,
    items,
    lotes,
    checked,
    onToggle,
    onRevisar,
    onVerTodo,
    mostrarChecks
}) => {
    const cantidadLotes = lotes ? lotes.length : 0;
    const stringLotes = cantidadLotes === 1 ? 'lote' : 'lotes';
    const seleccionados = Object.values(checked).some(Boolean);
    return (
        <div className="bg-white rounded-2xl p-5 flex-1 min-w-0 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {icono}
                    <Text variante="subtitle" style={{ color: colores.azul, fontWeight: 600 }}>
                        {titulo} {cantidadLotes > 0 && `(${cantidadLotes} ${stringLotes})`}
                    </Text>
                </div>
                <button onClick={onVerTodo} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                    <Text variante="small" style={{ color: colores.azul }}>
                        Ver todo
                    </Text>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l4 4-4 4" stroke={colores.azul} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            {items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 mt-10">
                    <Text variante="small" style={{ color: colores.gris }}>
                        No hay {titulo.toLowerCase()} por el momento
                    </Text>
                </div>
            ) : (
                <div className="max-h-[160px] overflow-y-auto pr-5">
                    {items.map(item => {
                        const lote = lotes?.find(
                            lote => lote.id_lote === item.id
                        );
                        return (
                            <FilaCheck
                                key={item.id}
                                item={item}
                                lote={lote}
                                checked={!!checked[item.id]}
                                onToggle={onToggle}
                                mostrarCheck={mostrarChecks}
                            />
                        );
                    })}
                </div>
            )}
            <div className="flex justify-end">
                {seleccionados && (
                    <button
                        onClick={onRevisar}
                        className="mt-3 px-3 py-1 text-sm rounded-full hover:bg-blue-50 transition-colors"
                        style={{
                            color: colores.azul,
                            backgroundColor: "#FFFFFF",
                            border: `1px solid ${colores.azul}`
                        }}
                    >
                        Marcar como revisado
                    </button>
                )}
            </div>
        </div>
    );
};

export default PanelLista;
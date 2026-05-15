import React from 'react';
import { Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/colores';
import { HugeiconsIcon } from '@hugeicons/react';
import FilaCheck from './FilaCheck';


const PanelLista = ({ icono, titulo, items, checked, onToggle, onVerTodo }) => {
    return (
        <div className="bg-white rounded-2xl p-5 flex-1 min-w-0 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {icono}
                    <Text variante="subtitle" style={{ color: colores.azul, fontWeight: 600 }}>
                        {titulo}
                    </Text>
                </div>
                <button onClick={onVerTodo} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                    <Text variante="small" style={{ color: colores.azul }}>Ver todo</Text>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l4 4-4 4" stroke={colores.azul} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <div>
                {items.map(item => (
                    <FilaCheck
                        key={item.id}
                        item={item}
                        checked={!!checked[item.id]}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
};

export default PanelLista;
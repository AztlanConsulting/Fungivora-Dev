import React from 'react';
import { Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/colores';

const FilaCheck = ({ item, checked, onToggle }) => {
    return (
        <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-100">
            <Text variante="body" style={{ color: colores.negro }}>
                {item.nombre}
            </Text>
            <div className="flex items-center gap-3">
                <Text variante="small" style={{ color: colores.gris }}>
                    {item.fecha}
                </Text>
                <button
                    onClick={() => onToggle(item.id)}
                    aria-label="Marcar"
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                    style={{
                        borderColor: checked ? colores.azul : colores.gris,
                        backgroundColor: checked ? colores.azul : 'transparent',
                    }}
                >
                    {checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FilaCheck;
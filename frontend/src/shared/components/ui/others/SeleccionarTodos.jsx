import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

import Text from '../basics/Texto';
import { colores } from '..//basics/Colores';

export const CustomCheckbox = ({ 
    checked, 
    onChange, 
    label, 
    activeColor = '#7F7FD5', // <-- Si no se pasa, usa tu color destacado
    textColor = colores.azul           // <-- Si no se pasa, usa tu azul
}) => {
    return (
        <label className="relative flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange && onChange(e.target.checked)}
            />

            <div
                className="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all peer-checked:bg-white"
                style={{
                    borderColor: checked ? activeColor : '#D1D1D1',
                }}
            >
                {checked && (
                    <HugeiconsIcon
                        icon={Tick02Icon}
                        size={16}
                        strokeWidth={3}
                        color={activeColor}
                    />
                )}
            </div>

            <Text variante="body" style={{ fontWeight: '600', color: textColor }}>
                {label}
            </Text>
        </label>
    );
};
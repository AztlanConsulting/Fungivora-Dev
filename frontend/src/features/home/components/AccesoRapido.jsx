import React from 'react';
import { Text } from '../../../shared/components/ui';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignCircleIcon } from '@hugeicons/core-free-icons';

const AccesoRapido = ({ label, ruta, color, acento, imagen }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(ruta)}
            className="rounded-2xl p-5 flex flex-col justify-between aspect-square hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{ backgroundColor: color, minHeight: 160 }}
        >
            <div
                className="w-full flex-1 rounded-xl mb-3 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${acento}22` }}
            >
                <img
                    src={imagen}
                    alt={label}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex items-center justify-between gap-2">
                <Text variante="body" style={{ color: acento, fontWeight: 600 }}>
                    {label}
                </Text>
                <HugeiconsIcon
                    icon={PlusSignCircleIcon}
                    size={28}
                    color={acento}
                    strokeWidth={1.8}
                />
            </div>
        </button>
    );
};

export default AccesoRapido;
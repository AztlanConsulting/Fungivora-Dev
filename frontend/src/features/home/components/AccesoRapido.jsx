import React from 'react';
import { Text } from '../../../shared/components/ui';
import { useNavigate } from 'react-router-dom';

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

            <div className="flex items-center justify-between">
                <Text variante="body" style={{ color: acento, fontWeight: 600 }}>
                    {label}
                </Text>
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ border: `2px solid ${acento}` }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 2v8M2 6h8" stroke={acento} strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </button>
    );
};

export default AccesoRapido;
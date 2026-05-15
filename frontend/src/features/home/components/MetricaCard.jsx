import React from 'react';
import { Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/colores';

const MetricaCard = ({ valor, label }) => {
    return (
        <div className="bg-gray-50 rounded-2xl px-6 py-4 flex flex-col items-center gap-1 flex-1">
            <Text variante="body" style={{ color: colores.gris, fontSize: 13, textAlign: 'center' }}>
                {label}
            </Text>
            <Text variante="title" style={{ color: colores.azul, fontWeight: 700, fontSize: 28 }}>
                {valor}
            </Text>
        </div>
    );
};

export default MetricaCard;
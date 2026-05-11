import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Text from '../../../shared/components/ui/basics/texto';
import { colores } from '../../../shared/components/ui/basics/colores';

const InfoLote = ({ icon: Icon, label, value, showDivider = true }) => (
    <div className="flex items-center gap-4 w-full md:flex-1 px-4">
        <div
            className="flex items-center justify-center min-w-[48px] h-[48px] rounded-full"
            style={{ backgroundColor: '#EBEBFF' }}
        >
            <HugeiconsIcon icon={Icon} size={36} color={colores.azul} />
        </div>
        <div className="flex flex-col">
            <Text variante="body" style={{ color: '#666', fontSize: '13px' }}>{label}</Text>
            <Text variante="option" style={{ color: '#1A1A40' }}>{value}</Text>
        </div>
        {/* El divisor solo se muestra en md (desktop) */}
        {showDivider && <div className="hidden md:block h-10 w-[1px] bg-gray-100 ml-auto" />}
    </div>
);

export default InfoLote;
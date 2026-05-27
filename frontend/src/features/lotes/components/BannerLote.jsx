import React from 'react';
import {
    Calendar03Icon, MushroomIcon, MoneyBag01Icon,
    Location01Icon
} from '@hugeicons/core-free-icons';
import InfoLote from './InfoLote';

const BannerLote = ({ data }) => {
    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 p-4 flex flex-col md:flex-row items-center md:items-center shadow-sm gap-4 md:gap-0">
            <InfoLote icon={Calendar03Icon} label="Fecha de creación" value={data.fecha} />
            <InfoLote icon={MushroomIcon} label="Especie" value={data.especie} />
            <InfoLote icon={Location01Icon} label="Ubicación" value={data.ubicacion} />
        </div>
    );
};

export default BannerLote;
import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Text from '../../../shared/components/ui/basics/Texto';
import { Stepper, BarraBusqueda } from '../../../shared/components/ui';
//const SeccionFaseBuscar = ({ fases, fase, setFase, busqueda, setBusqueda }) => {
const SeccionFaseBuscar = ({ fases, fase, setFase }) => {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-6 w-full">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex-1 w-full">
                <Stepper
                    steps={fases}
                    currentStep={fase}
                    onStepChange={setFase}
                    colorTheme="azul"
                />
            </div>
            {/* 
            <div className="w-full lg:w-1/3">
                <BarraBusqueda value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            */}
        </div>
    );
};

export default SeccionFaseBuscar;
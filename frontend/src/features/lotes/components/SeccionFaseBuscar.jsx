import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

import Text from '../../../shared/components/ui/basics/Texto';
import { colores } from '../../../shared/components/ui/basics/Colores';
import { Stepper } from '../../../shared/components/ui';
import { CustomCheckbox } from '../../../shared/components/ui/others/SeleccionarTodos';

const colorBordeDestacado = '#7F7FD5';

//const SeccionFaseBuscar = ({ fases, fase, setFase, busqueda, setBusqueda }) => {
const SeccionFaseBuscar = ({
    fases,
    fase,
    setFase,
    todosContaminados,
    onToggleTodosContaminados
}) => {
   

    return (
        <div className="flex flex-col lg:flex-row items-center gap-6 w-full">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex-1 w-full">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    <div className="flex-1">
                        <Stepper
                            steps={fases}
                            currentStep={fase}
                            onStepChange={setFase}
                            colorTheme="azul"
                        />
                    </div>

                    <div className="flex justify-end">
                         <CustomCheckbox
                            checked={todosContaminados}
                            onChange={onToggleTodosContaminados}
                            label={
                                <>
                                    Marcar todos <br /> como contaminados
                                </>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeccionFaseBuscar;
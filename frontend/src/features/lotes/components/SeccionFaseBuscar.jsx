import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

import Text from '../../../shared/components/ui/basics/Texto';
import { colores } from '../../../shared/components/ui/basics/Colores';
import { Stepper } from '../../../shared/components/ui';

const colorBordeDestacado = '#7F7FD5';

//const SeccionFaseBuscar = ({ fases, fase, setFase, busqueda, setBusqueda }) => {
const SeccionFaseBuscar = ({
    fases,
    fase,
    setFase,
    todosContaminados,
    onToggleTodosContaminados
}) => {
    const renderCheckboxTodos = () => (
        <label className="relative flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={todosContaminados}
                onChange={() =>
                    onToggleTodosContaminados &&
                    onToggleTodosContaminados(!todosContaminados)
                }
            />

            <div
                className="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all peer-checked:bg-white"
                style={{
                    borderColor: todosContaminados
                        ? colorBordeDestacado
                        : '#D1D1D1',
                }}
            >
                {todosContaminados && (
                    <HugeiconsIcon
                        icon={Tick02Icon}
                        size={16}
                        strokeWidth={3}
                        color={colorBordeDestacado}
                    />
                )}
            </div>

            <Text variante="body" style={{ fontWeight: '600', color: colores.azul }}>
                Marcar todos <br /> como contaminados
            </Text>
        </label>
    );

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
                        {renderCheckboxTodos()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeccionFaseBuscar;
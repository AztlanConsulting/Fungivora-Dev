import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

import Text from '../../../shared/components/ui/basics/Texto';
import Button from '../../../shared/components/ui/buttons/Botones';
import SelectField from '../../../shared/components/ui/inputs/SeleccionarTexto';
import { colores } from '../../../shared/components/ui/basics/Colores';
import { TIPOS_INOCULO } from '../types/inoculo.types';

/**
 * Modal para seleccionar el tipo de inóculo antes de crear uno nuevo.
 *
 * @param {{
 *   visible: boolean,
 *   onConfirm: (tipo: string) => void,
 *   onCancel: () => void,
 * }} props
 */
const ModalCrearInoculo = ({ visible, onConfirm, onCancel }) => {
    const [tipoSeleccionado, setTipoSeleccionado] = useState(TIPOS_INOCULO[0].value);

    if (!visible) return null;

    const handleConfirm = () => {
        onConfirm(tipoSeleccionado);
        setTipoSeleccionado(TIPOS_INOCULO[0].value); // reset
    };

    const handleCancel = () => {
        setTipoSeleccionado(TIPOS_INOCULO[0].value); // reset
        onCancel();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleCancel}
            />

            {/* Caja del modal */}
            <div className="relative bg-white rounded-[30px] p-9 w-full max-w-lg shadow-2xl flex flex-col items-center text-center gap-8 border border-gray-100 animate-in fade-in zoom-in duration-200">

                {/* Botón cerrar */}
                <button
                    onClick={handleCancel}
                    className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                    style={{ backgroundColor: `${colores.gris}20` }}
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={20} color={colores.gris} />
                </button>

                {/* Título */}
                <Text variante="popup" style={{ color: colores.azul }}>
                    ¿Qué tipo de inóculo quieres crear?
                </Text>

                {/* Select de tipo */}
                <SelectField
                    value={tipoSeleccionado}
                    onChange={(e) => setTipoSeleccionado(e.target.value)}
                    options={TIPOS_INOCULO}
                    size="amplio"
                    placeholder="Tipo de inóculo"
                />

                <div className="w-full h-[1.8px] bg-gray-200 rounded-full" />

                {/* Botones */}
                <div className="flex flex-row gap-6 w-full justify-center">
                    <Button variant="confirmar" isOutline={true} onClick={handleConfirm}>
                        Confirmar
                    </Button>
                    <Button variant="cancelar" isOutline={true} onClick={handleCancel}>
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalCrearInoculo;
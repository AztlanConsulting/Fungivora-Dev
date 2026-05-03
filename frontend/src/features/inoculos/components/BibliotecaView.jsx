import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Titulo, Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/colores';
import { Base } from '../../../shared/components/layout';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import useEspeciesList from '../hooks/useEspeciesList';
import InoculoCard from './InoculoCard';
import ModalCrearInoculo from './ModalCrearInoculo';

/**
 * Vista principal del módulo de inóculos.
 * Renderiza una card por cada especie devuelta por getAllEspecies.
 */
const BibliotecaView = () => {
    const { especies, loading, error } = useEspeciesList();
    const [modalVisible, setModalVisible] = useState(false);

    const navigate = useNavigate();

    const RUTAS_TIPO = {
        'Agar': '/inoculos/crear/agar',
        'Medio Líquido': '/inoculos/crear/medio-liquido',
        'Semilla': '/inoculos/crear/semilla',
    };

    const handleConfirmarCrear = (tipo) => {
        setModalVisible(false);
        navigate(RUTAS_TIPO[tipo]);
    };

    return (
        <>
            <Titulo>Biblioteca Genética</Titulo>

            {/* FAB circular — esquina inferior derecha */}
            <button
                onClick={() => setModalVisible(true)}
                aria-label="Crear inóculo"
                className="fixed bottom-20 right-10 md:bottom-10 md:right-10 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-opacity hover:opacity-80 active:scale-95"
                style={{ backgroundColor: colores.verdeAccent }}
            >
                <HugeiconsIcon icon={Add01Icon} size={28} color={colores.blanco} />
            </button>

            <Base margen_arriba="mt-24 md:mt-20">
                <div className="flex flex-col gap-4">
                    {loading && (
                        <Text variante="body" style={{ color: colores.gris, fontStyle: 'italic' }}>
                            Cargando especies...
                        </Text>
                    )}

                    {error && (
                        <Text variante="body" style={{ color: 'red', fontStyle: 'italic' }}>
                            {error}
                        </Text>
                    )}

                    {!loading && !error && especies.length === 0 && (
                        <Text variante="body" style={{ color: colores.gris }}>
                            No hay especies registradas.
                        </Text>
                    )}

                    {!loading && !error && especies.map((especie) => (
                        <InoculoCard key={especie.value} especie={especie} />
                    ))}
                </div>
            </Base>

            <ModalCrearInoculo
                visible={modalVisible}
                onConfirm={handleConfirmarCrear}
                onCancel={() => setModalVisible(false)}
            />
        </>
    );
};

export default BibliotecaView;
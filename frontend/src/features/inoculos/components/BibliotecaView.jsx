import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Titulo, Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/colores';
import { Base } from '../../../shared/components/layout';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import useEspeciesList from '../hooks/useEspeciesList';
import InoculoCard from './InoculoCard';
import ModalCrearInoculo from './ModalCrearInoculo';
import ModalAlerta from '../../../shared/components/ui/popups/ModalAlerta';

/**
 * Vista principal del módulo de inóculos.
 * Renderiza una card por cada especie devuelta por getAllEspecies.
 */
const BibliotecaView = () => {
    const location = useLocation();
    const [alerta, setAlerta] = useState(
        location.state?.alerta
            ? { ...location.state.alerta, visible: true }
            : { visible: false, variante: "exito", mensaje: "" }
    );
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

            {/* FAB circular — esquina inferior derecha — No se usa Botones por falta de className en ese componente */}
            <button
                onClick={() => setModalVisible(true)}
                aria-label="Crear inóculo"
                className={`
                    fixed bottom-20 right-10 md:bottom-10 md:right-16
                    z-50 w-40 h-8 md:w-52 md:h-10 text-base md:text-lg
                    rounded-full flex items-center justify-center shadow-lg
                    transition-opacity hover:opacity-80 active:scale-95
                `}

                style={{
                    backgroundColor: "#FFFFFF",
                    border: `2px solid ${colores.azul}`
                }}
            >
                <Text variante='button' style={{ color: colores.azul }}>Crear</Text>
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
            <ModalAlerta
                visible={alerta.visible}
                variante={alerta.variante}
                mensaje={alerta.mensaje}
                onClose={() => setAlerta((a) => ({ ...a, visible: false }))}
            />

        </>
    );
};

export default BibliotecaView;
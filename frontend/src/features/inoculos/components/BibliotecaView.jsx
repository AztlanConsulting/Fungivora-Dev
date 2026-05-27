import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Titulo, Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/Colores';
import { Base } from '../../../shared/components/layout';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import useEspeciesList from '../hooks/useEspeciesList';
import InoculoCard from './InoculoCard';
import ModalCrearInoculo from './ModalCrearInoculo';
import ModalAlerta from '../../../shared/components/ui/popups/ModalAlerta';
import BotonCrear from '../../../shared/components/ui/buttons/BotonFlotante';

/**
 * Vista principal del módulo de inóculos.
 * Renderiza una card por cada especie devuelta por getAllEspecies.
 */
const BibliotecaView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [alerta, setAlerta] = useState(() => {
        if (location.state?.alerta) {
            return {
                ...location.state.alerta,
                visible: true,
            };
        }
        return {
            visible: false,
            variante: "exito",
            mensaje: "",
        };
    });
    const { especies, loading, error } = useEspeciesList();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!location.state?.alerta) return;

        // Limpiar el state del history para que back/forward no reabra la alerta.
        navigate(location.pathname + location.search, {
            replace: true,
            state: null,
        });
    }, [location.state, location.pathname, location.search, navigate]);

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
            
            <BotonCrear 
                onClick={() => setModalVisible(true)} 
                texto="Crear"
                aria-label="Crear inóculo"
            />

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
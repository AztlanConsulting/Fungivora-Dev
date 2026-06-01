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
import SelectField from '../../../shared/components/ui/inputs/SeleccionarTexto';
import { TIPOS_INOCULO } from '../types/inoculo.types';

/**
 * Vista principal del módulo de inóculos.
 * Renderiza una card por cada especie devuelta por getAllEspecies.
 */
const BibliotecaView = () => {
    const location = useLocation();
    const [tipoGlobal, setTipoGlobal] = useState('Agar');
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
                ariaLabel="Crear inóculo"
            />

            

            <Base margen_arriba="mt-24 md:mt-20">
               <div className="flex justify-end items-center gap-4 mb-6">
                    <Text variante="label" style={{ color: colores.gris }}>
                        Selecciona un tipo para todos:
                    </Text>
                    <div className="w-32 md:w-44"> 
                        <SelectField
                            value={tipoGlobal}
                            onChange={(e) => setTipoGlobal(e.target.value)}
                            options={TIPOS_INOCULO}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {loading && (
                        <div className="flex justify-center items-center h-[200px] w-full">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <Text variante="medium">Cargando datos de inóculos...</Text>
                            </div>
                        </div>
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

                    {!loading && !error && especies.map((especie, index) => (
                        <InoculoCard 
                            key={especie.id_especie ? especie.id_especie : `${especie.value}-${index}`} 
                            especie={especie} 
                            tipoForzado={tipoGlobal}
                        />
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
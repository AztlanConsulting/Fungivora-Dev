import React, { useEffect, useState, useMemo } from 'react';
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
    const [excepciones, setExcepciones] = useState({});
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

    const handleIndividualChange = (especieValue, nuevoTipo) => {
        setExcepciones(prev => {
            const next = { ...prev };
            if (nuevoTipo === tipoGlobal) {
                delete next[especieValue];
            } else {
                next[especieValue] = nuevoTipo;
            }
            return next;
        });
    };


    const handleConfirmarCrear = (tipo) => {
        setModalVisible(false);
        navigate(RUTAS_TIPO[tipo]);
    };

    const isMixto = Object.keys(excepciones).length > 0;

    const opcionesSelectGlobal = useMemo(() => {
        const baseOptions = [...TIPOS_INOCULO];
        if (isMixto) {
            return [
                { value: 'mixto', label: '- Mixto -' },
                ...baseOptions
            ];
        }
        return baseOptions;
    }, [isMixto]);

    const handleGlobalChange = (e) => {
        const nuevoTipo = e.target.value;
        if (nuevoTipo !== 'mixto') {
            setTipoGlobal(nuevoTipo);
            setExcepciones({}); 
        }
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
                    {isMixto ? "Estado: Variados" : "Selecciona un tipo para todos:"}
                </Text>
                <div className="w-32 md:w-44"> 
                    <SelectField
                        value={isMixto ? 'mixto' : tipoGlobal}
                        onChange={handleGlobalChange}
                        options={opcionesSelectGlobal}
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

                    {!loading && !error && especies.map((especie) => (
                        <InoculoCard 
                            key={especie.value} 
                            especie={especie} 
                            tipoForzado={excepciones[especie.value] || tipoGlobal}
                            onIndividualChange={(tipo) => handleIndividualChange(especie.value, tipo)}
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
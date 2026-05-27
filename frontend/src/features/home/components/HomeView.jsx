import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon, PackageIcon } from '@hugeicons/core-free-icons';
import { Titulo, Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/Colores';
import { Base } from '../../../shared/components/layout';
import AccesoRapido from './AccesoRapido';
import MetricaCard from './MetricaCard';
import PanelLista from './PanelLista';
import useHome from '../hooks/useHome';

import accesoAgar from '../../../assets/images/acceso-agar.png';
import accesoMedioLiquido from '../../../assets/images/acceso-medio-liquido.png';
import accesoSemilla from '../../../assets/images/acceso-semilla.png';
import accesoLote from '../../../assets/images/acceso-lote.png';

/**
 * Vista principal / Dashboard de Devora.
 * Muestra lotes por revisar, inventario bajo, accesos rápidos y resumen general.
 */
const PantallaPrincipalView = () => {
    const navigate = useNavigate();

    const {
        dashboard,
        loading,
        error,
        revisarLotes
    } = useHome();

    // Datos del hook
    const cards = dashboard?.cards || {};

    const listas = dashboard?.listas || {};

    const lotes = dashboard?.lotes || {};

    const resumen = {
        lotesActivos: cards.lotesActivos,
        bloquesNoContaminados: cards.bloquesNoContaminados,
        bloquesContaminados: cards.bloquesContaminados,
    };

    const RUTAS_RAPIDAS = [
        { label: 'Crear Agar', ruta: '/inoculos/crear/agar', color: '#ffffff', acento: colores.azul, imagen: accesoAgar },
        { label: 'Crear Medio Líquido', ruta: '/inoculos/crear/medio-liquido', color: '#ffffff', acento: '#5b9e41', imagen: accesoMedioLiquido },
        { label: 'Crear Semilla', ruta: '/inoculos/crear/semilla', color: '#ffffff', acento: '#bb6631', imagen: accesoSemilla },
        { label: 'Crear Lote', ruta: '/lotes', color: '#ffffff', acento: '#684cb6', imagen: accesoLote },
    ];

    // Estado checkboxes 
    const [checkedLotes, setCheckedLotes] = useState({});
    const [checkedInv, setCheckedInv] = useState({});

    const toggleLote = (id) => setCheckedLotes(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleInv = (id) => setCheckedInv(prev => ({ ...prev, [id]: !prev[id] }));

    const handleRevisarLotes = async () => {
        try {
            // Obtener ids marcados
            const idsSeleccionados = Object.keys(checkedLotes)
                .filter(id => checkedLotes[id]);
            // Evitar llamada vacía
            if (idsSeleccionados.length === 0) {
                return;
            }
            // Hook
            await revisarLotes(idsSeleccionados);
            // Limpiar checks
            setCheckedLotes({});
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <Base margen_arriba="mt-24 md:mt-20">
                <Text variante="medium" style={{ color: colores.azul, textAlign: 'center' }}>
                    Cargando dashboard...
                </Text>
            </Base>
        );
    }

    if (error) {
        return (
            <Base margen_arriba="mt-24 md:mt-20">
                <Text variante="medium" style={{ color: '#E53E3E', textAlign: 'center' }}>
                    Error al cargar los datos del servidor.
                </Text>
            </Base>
        );
    }
    
    // Render 
    return (
        <>
            <Titulo>¡Bienvenid@ a Devora!</Titulo>

            <Base margen_arriba="mt-24 md:mt-20">
                <div className="flex flex-col gap-6">

                    {/* Fila 1 — Lotes por revisar + Inventario bajo */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <PanelLista
                            icono={
                                <HugeiconsIcon
                                    icon={Clock01Icon}
                                    size={22}
                                    color={colores.azul}
                                    strokeWidth={2}
                                />
                            }
                            titulo="Lotes por revisar"
                            items={listas.lotesRevision || []}
                            lotes={lotes || []}
                            checked={checkedLotes}
                            onToggle={toggleLote}
                            onRevisar={handleRevisarLotes}
                            onVerTodo={() => navigate('/lotes')}
                            mostrarChecks={true}
                        />
                        <PanelLista
                            icono={
                                <HugeiconsIcon
                                    icon={PackageIcon}
                                    size={22}
                                    color={colores.azul}
                                    strokeWidth={2}
                                />
                            }
                            titulo="Inventario bajo"
                            items={listas.inventarioBajo || []}
                            checked={checkedInv}
                            onToggle={toggleInv}
                            onVerTodo={() => navigate('/inventario')}
                            mostrarChecks={false}
                        />
                    </div>

                    {/* Fila 2 — Accesos rápidos */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {RUTAS_RAPIDAS.map((item) => (
                            <AccesoRapido key={item.label} {...item} />
                        ))}
                    </div>

                    {/* Fila 3 — Resumen general */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-shrink-0">
                                <Text variante="subtitle" style={{ color: colores.azul, fontWeight: 700, fontSize: 20 }}>
                                    Resumen general
                                </Text>
                            </div>

                            <Text variante="small" style={{ color: colores.gris }}>
                                Actividad actual
                            </Text>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
                                <MetricaCard valor={resumen.lotesActivos} label="Lotes activos" />
                                <MetricaCard valor={resumen.bloquesNoContaminados} label="Bloques saludables" />
                                <MetricaCard valor={resumen.bloquesContaminados} label="Bloques contaminados" />
                            </div>
                        </div>
                    </div>

                </div>
            </Base>
        </>
    );
};

export default PantallaPrincipalView;
import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useDetalleLote from '../hooks/useDetalleLote';
import BannerLote from '../components/BannerLote';
import TablaBloques from '../components/TablaBloques';
import SeccionFaseBuscar from '../components/SeccionFaseBuscar';
import { Titulo, Text } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/colores';
import { Base } from '../../../shared/components/layout';

// Detalle de cada lote con toda su información
const DetalleLote = () => {
    const { id_lote } = useParams();
    const { state } = useLocation();

    const { bloques, setBloques, especie, codigoInoculo, codigoLoteBD, cargando, error, guardarCambios } = useDetalleLote(
        id_lote,
        state?.id_inoculo
    );

    const [fase, setFase] = useState(state?.fase || "Inoculación");
    const [busqueda, setBusqueda] = useState("");
    const [editado, setEditado] = useState(false);

    const handleLocalToggleContaminado = (id_bloque) => {
        const nuevosBloques = bloques.map(bloque => {
            if (bloque.id_bloque === id_bloque) {
                return {
                    ...bloque,
                    contaminado: bloque.contaminado === 1 ? 0 : 1
                };
            }
            return bloque;
        });
        setBloques(nuevosBloques);
        setEditado(true);
    };

    const onGuardar = async () => {
        const resultado = await guardarCambios(bloques);
        if (resultado.success) {
            setEditado(false);
            alert("Cambios sincronizados con éxito.");
        } else {
            alert("Error al guardar: " + resultado.error);
        }
    };

    const fases = [
        { label: "Inoculación" }, { label: "Colonización" }, { label: "Fructificación" },
        { label: "Cosecha 1" }, { label: "Cosecha 2" }, { label: "Finalización" },
    ];

   const loteData = {
        fecha: state?.fecha_lote 
            ? new Date(state.fecha_lote).toLocaleDateString('es-MX', {
                day: '2-digit', month: 'long', year: 'numeric'
            }) : 'Sin fecha',
        especie: cargando ? 'Cargando...' : especie || 'S/N',
        sustrato: state?.tipo_sustrato || 'No especificado',
        ubicacion: state?.ubicacion_lote || 'Sin ubicación', 
        inoculo: cargando ? 'Cargando...' : codigoInoculo || 'S/N'
    };

    const bloquesFiltrados = bloques?.filter(b =>
        String(b.id_bloque).includes(busqueda) ||
        b.contenedor?.toLowerCase().includes(busqueda.toLowerCase())
    ) || [];


    const codigoParaTabla = state?.codigo_fungivora || codigoLoteBD || "";
        return (
            <>
                <Titulo>Lote: {state?.codigo_fungivora || 'Detalle'}</Titulo>

                {editado && (
                    <button
                        onClick={onGuardar}
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
                        <Text variante='button' style={{ color: colores.azul }}>
                            Guardar Cambios
                        </Text>
                    </button>
                )}

                <Base margen_arriba="mt-16 md:mt-8">
                    <div className="p-6 flex flex-col gap-8">
                        <BannerLote data={loteData} />

                        <SeccionFaseBuscar
                            fases={fases}
                            fase={fase}
                            setFase={setFase}
                            busqueda={busqueda}
                            setBusqueda={setBusqueda}
                        />

                        <div className="flex flex-col gap-4">
                            {error && (
                                <div className="text-red-500 px-2 font-medium">Error: {error}</div>
                            )}

                            <TablaBloques
                                bloques={bloquesFiltrados}
                                loading={cargando}
                                onToggleContaminado={handleLocalToggleContaminado}
                                codigo_lote={codigoParaTabla}
                            />
                        </div>
                    </div>
                </Base>
            </>
        );
    };

export default DetalleLote;
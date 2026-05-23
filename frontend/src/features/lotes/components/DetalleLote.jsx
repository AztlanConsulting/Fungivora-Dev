import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useDetalleLote from '../hooks/useDetalleLote';
import BannerLote from '../components/BannerLote';
import TablaBloques from '../components/TablaBloques';
import SeccionFaseBuscar from '../components/SeccionFaseBuscar';
import { Titulo, Text, ModalConfirmacion, ModalAlerta } from '../../../shared/components/ui';
import { colores } from '../../../shared/components/ui/basics/colores';
import { Base } from '../../../shared/components/layout';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';

// Detalle de cada lote con toda su información
const DetalleLote = () => {
    const { id_lote } = useParams();
    const { state } = useLocation();

    const {
        bloques, setBloques, bloquesIniciales, setBloquesIniciales,
        fase, setFase, faseInicialNum, setFaseInicialNum,
        especie, codigoInoculo,
        cargando, error, getFase, guardarCambios,
        fases
    } = useDetalleLote(id_lote, state?.fase);

    const [busqueda, setBusqueda] = useState("");
    const [editado, setEditado] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alerta, setAlerta] = useState({ visible: false, variante: "exito", mensaje: "" });

    const handleLocalChanges = (nuevosBloques = bloques, nuevaFase = fase) => {
        // Verificar cambio de fase
        const faseModificada = nuevaFase !== faseInicialNum;

        // Verificar cambios en bloques
        const bloquesModificados = nuevosBloques.some((bloque, index) => {
            const bloqueInicial = bloquesIniciales?.[index];
            if (!bloqueInicial) return false;

            return (
                bloque.contaminado !== bloqueInicial?.contaminado
            );
        });

        setEditado(faseModificada || bloquesModificados);
    };

    // Cambio local de bloques contaminados
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
        handleLocalChanges(nuevosBloques, fase);
    };

    // Cambio local de fase
    const handleLocalChangeFase = (nuevaFase) => {
        setFase(nuevaFase);
        handleLocalChanges(bloques, nuevaFase);
    }

    const onGuardar = async () => {
        setIsModalOpen(false);
        const resultado = await guardarCambios(bloques, fase);
        if (resultado.success) {
            setBloquesIniciales(
                bloques.map(b => ({ ...b }))
            );
            setFaseInicialNum(fase);
            setEditado(false);
            setAlerta({
                visible: true,
                variante: "exito",
                mensaje: "Cambios guardados exitosamente"
            });
        } else {
            setAlerta({
                visible: true,
                variante: "error",
                mensaje: "Error al guardar: " + resultado.error
            });
        }
    };


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


    const codigoParaTabla = state?.codigo_fungivora || codigoInoculo || "";
    return (
        <>
            <Titulo>Lote: {state?.codigo_fungivora || 'Detalle'}</Titulo>
            {editado && (
                <button
                    onClick={() => setIsModalOpen(true)}
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
                        <span className="md:hidden">Actualizar</span>
                        <span className="hidden md:inline">Actualizar</span>
                    </Text>
                </button>
            )}

            <Base margen_arriba="mt-16 md:mt-8">
                <div className="p-6 flex flex-col gap-8">
                    <BannerLote data={loteData} />

                    <SeccionFaseBuscar
                        fases={fases}
                        fase={fase}
                        setFase={handleLocalChangeFase}
                    //busqueda={busqueda}
                    //setBusqueda={setBusqueda}
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

            <ModalAlerta
                visible={alerta.visible}
                variante={alerta.variante}
                mensaje={alerta.mensaje}
                onClose={() => setAlerta({ ...alerta, visible: false })}
            />

            {/* MODAL */}
            <ModalConfirmacion
                visible={isModalOpen}
                icon={CheckmarkCircle02Icon}
                titulo="¿Confirmar cambios?"
                descripcion={
                    <>
                        <span className="font-semibold">Nueva Fase:</span> {getFase(fase)}
                        <br />
                        <span className="font-semibold">Bloques contaminados:</span> {bloques.filter(b => b.contaminado === 1).length}
                    </>
                }
                onConfirm={onGuardar}
                onCancel={() => setIsModalOpen(false)}
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
            />
        </>
    );
};

export default DetalleLote;
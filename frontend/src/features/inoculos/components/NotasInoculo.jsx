import React, { useState } from 'react';
import { Text } from '../../../shared/components/ui'; 
import InputFecha from '../../../shared/components/ui/inputs/InputFecha';
import Button from '../../../shared/components/ui/buttons/Botones';
import useNotasInoculo from '../hooks/useNotasInoculo';
import TarjetaNota from '../../../shared/components/ui/cards/AreaNotas';
import InputNota from '../../../shared/components/ui/inputs/InputNota'; 
import BotonCrear from '../../../shared/components/ui/buttons/BotonFlotante';
import ModalAlerta from '../../../shared/components/ui/popups/ModalAlerta';

const NotasInoculo = ({ id_inoculo }) => {
    const { notas, cargando, postNota } = useNotasInoculo(id_inoculo);
    const [nuevaNota, setNuevaNota] = useState("");
    const [error, setError] = useState(""); 
    const [alerta, setAlerta] = useState({ visible: false, variante: 'exito', mensaje: '' });

    const getFechaHoy = () => {
        const hoy = new Date();
        return {
            day: String(hoy.getDate()).padStart(2, "0"),
            month: String(hoy.getMonth() + 1).padStart(2, "0"),
            year: String(hoy.getFullYear())
        };
    };

    const [fecha, setFecha] = useState(getFechaHoy());

    const esInvalido = !nuevaNota.trim() || !fecha.day || !fecha.month || !fecha.year;

    const [verFormulario, setVerFormulario] = useState(false);

    const handleGuardar = async () => {
        setError("");
        const notaLimpia = nuevaNota.trim();
        
        if (!notaLimpia) {
            setError("La nota no puede estar vacía.");
            return;
        }
        
        const fechaISO = `${fecha.year}-${fecha.month}-${fecha.day}`;
        
        try {
            await postNota({ id_inoculo, fecha: fechaISO, notas_bitacora: notaLimpia });
            
            setAlerta({ visible: true, variante: 'exito', mensaje: 'Nota agregada correctamente.' });
            
            setNuevaNota("");
            setFecha(getFechaHoy());
        } catch {
            setAlerta({ visible: true, variante: 'error', mensaje: 'Error al guardar la nota. Intenta de nuevo.' });
        }
    };

    const handleChange = (val) => {
        if (error) setError("");
        setNuevaNota(val);
    };

    const formatearFecha = (fechaISO) => {
        const d = new Date(fechaISO);
        return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
    };

return (
    <>
    <div className="w-full h-auto min-h-[500px] md:h-[500px] bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 overflow-hidden">
        <div className="md:hidden flex justify-center mb-4">
            <BotonCrear 
                variant="registrar" 
                onClick={() => setVerFormulario(!verFormulario)}
                className="w-full"
                texto={verFormulario ? "Ver Notas" : "Agregar Nota"}
            />
        </div>
    <div className={`flex-[2] flex flex-col h-full overflow-hidden ${verFormulario ? "hidden md:flex" : "flex"}`}>
        <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 py-2 max-h-[400px] md:max-h-none">
            {cargando ? (
                <div className="flex flex-col justify-center items-center h-full w-full gap-2">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <Text variante="medium">Cargando...</Text>
                </div>
            ) : notas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
                    {notas.map((nota) => (
                        <div key={nota.id_bitacora} className="h-[310px] md:h-[280px]">
                            <TarjetaNota
                                fecha={formatearFecha(nota.fecha_bitacora)}
                                preview={nota.notas_bitacora}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-[200px] w-full">
                    <Text style={{ color: "#515151" }}>No hay notas registradas.</Text>
                </div>
            )}
        </div>
    </div>

        <div className={`w-full md:w-1/3 flex flex-col gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 items-center ${verFormulario ? "block" : "hidden md:flex"}`}>
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2">
                    <Text variante="label" style={{ color: "black"}}>Fecha</Text>
                    <InputFecha value={fecha} onChange={setFecha} />
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <Text variante="label" style={{ color: "black" }}>Notas</Text>
                        <Text variante="label" style={{ color: nuevaNota.length >= 250 ? 'red' : '#999' }}>
                            {nuevaNota.length}/250
                        </Text>
                    </div>
                    <InputNota 
                        value={nuevaNota}
                        onChange={handleChange}
                        placeholder="Escribe tu nota..." 
                    />
                </div>
            </div>

            <Button 
                onClick={handleGuardar} 
                variant="registrar" 
                className="w-full justify-center" 
                disabled={esInvalido}
            >
                Agregar
            </Button>
        </div>
    </div>
            <ModalAlerta 
                visible={alerta.visible}
                variante={alerta.variante}
                mensaje={alerta.mensaje}
                onClose={() => setAlerta({ ...alerta, visible: false })}
            />
    </>
);
};

export default NotasInoculo;
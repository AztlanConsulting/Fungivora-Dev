import React from "react"
import { Text, Titulo, Botones } from '../../../shared/components/ui'

const ResultadoPrueba = ({ resultado, cargando, error, onEjecutar, onLimpiar }) => {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Título */}
            <Titulo>Prueba</Titulo>

            {/* Botón */}
            <Botones variant="registrar" onClick={onEjecutar}>
                Ejecutar prueba
            </Botones>

            <Botones variant="cancelar" onClick={onLimpiar}>
                Limpiar
            </Botones>

            {/* Estado de carga */}
            {cargando && (
                <Text>Ejecutando prueba...</Text>
            )}

            {/* Error */}
            {error && (
                <div className="flex flex-col gap-2">
                    <Text>Error: {error}</Text>
                </div>
            )}

            {/* Resultado */}
            {resultado && !error && !cargando && (
                <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <Text>Status</Text>
                        <Text>{resultado.status}</Text>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Text>Tiempo de respuesta</Text>
                        <Text>{resultado.tiempo_respuesta}</Text>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Text>Registros recuperados</Text>
                        <Text>{resultado.datos_recuperados}</Text>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResultadoPrueba
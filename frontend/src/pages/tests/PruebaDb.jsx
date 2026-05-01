import React from 'react'
import ResultadoPrueba from '../../features/ejemplo/components/ResultadoPrueba'
import usePruebaDb from '../../features/ejemplo/hooks/usePruebaDb'

const PruebaDb = () => {
    const { resultado, cargando, error, ejecutar, limpiar } = usePruebaDb()

    return (
        <div className="p-8">
            <ResultadoPrueba
                resultado={resultado}
                cargando={cargando}
                error={error}
                onEjecutar={ejecutar}
                onLimpiar={limpiar}
            />
        </div>
    )
}

export default PruebaDb
import { useState, useCallback } from "react";
import pruebaDbService from "../services/prueba_db.service";

const usePruebaDb = () => {
    const [resultado, setResultado] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    const ejecutar = useCallback(async () => {
        setCargando(true)
        setError(null)
        try {
            const data = await pruebaDbService.getEstres()
            setResultado(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }, [])

    const limpiar = useCallback(() => {
        setResultado(null)
        setError(null)
    }, [])

    return {
        resultado,
        cargando,
        error,
        ejecutar,
        limpiar
    }
}

export default usePruebaDb;
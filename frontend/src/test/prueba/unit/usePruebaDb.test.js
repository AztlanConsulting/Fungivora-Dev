import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import usePruebaDb from '../../../features/ejemplo/hooks/usePruebaDb'

// Mock del servicio
vi.mock('../../../features/ejemplo/services/prueba_db.service')
import pruebaDbService from '../../../features/ejemplo/services/prueba_db.service'

const resultadoMock = {
    status: 'success',
    tiempo_respuesta: '38ms',
    datos_recuperados: 100,
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe('usePruebaDb — estado inicial', () => {
    it('inicia con resultado null', () => {
        const { result } = renderHook(() => usePruebaDb())
        expect(result.current.resultado).toBeNull()
    })

    it('inicia con cargando false', () => {
        const { result } = renderHook(() => usePruebaDb())
        expect(result.current.cargando).toBe(false)
    })

    it('inicia con error null', () => {
        const { result } = renderHook(() => usePruebaDb())
        expect(result.current.error).toBeNull()
    })
})

describe('usePruebaDb — ejecutar', () => {
    it('pone cargando en true mientras espera', async () => {
        // Promesa que no resuelve inmediatamente
        let resolver
        pruebaDbService.getEstres.mockReturnValue(
            new Promise((res) => { resolver = res })
        )

        const { result } = renderHook(() => usePruebaDb())

        act(() => { result.current.ejecutar() })
        expect(result.current.cargando).toBe(true)

        await act(async () => { resolver(resultadoMock) })
        expect(result.current.cargando).toBe(false)
    })

    it('guarda el resultado al resolver correctamente', async () => {
        pruebaDbService.getEstres.mockResolvedValue(resultadoMock)

        const { result } = renderHook(() => usePruebaDb())

        await act(async () => { await result.current.ejecutar() })

        expect(result.current.resultado).toEqual(resultadoMock)
        expect(result.current.error).toBeNull()
    })

    it('guarda el error cuando el servicio falla', async () => {
        pruebaDbService.getEstres.mockRejectedValue(new Error('Timeout'))

        const { result } = renderHook(() => usePruebaDb())

        await act(async () => { await result.current.ejecutar() })

        expect(result.current.error).toBe('Timeout')
        expect(result.current.resultado).toBeNull()
    })

    it('limpia el error anterior antes de ejecutar de nuevo', async () => {
        pruebaDbService.getEstres
            .mockRejectedValueOnce(new Error('Fallo'))
            .mockResolvedValueOnce(resultadoMock)

        const { result } = renderHook(() => usePruebaDb())

        await act(async () => { await result.current.ejecutar() })
        expect(result.current.error).toBe('Fallo')

        await act(async () => { await result.current.ejecutar() })
        expect(result.current.error).toBeNull()
        expect(result.current.resultado).toEqual(resultadoMock)
    })
})

describe('usePruebaDb — limpiar', () => {
    it('resetea resultado y error a null', async () => {
        pruebaDbService.getEstres.mockResolvedValue(resultadoMock)

        const { result } = renderHook(() => usePruebaDb())

        await act(async () => { await result.current.ejecutar() })
        expect(result.current.resultado).toEqual(resultadoMock)

        act(() => { result.current.limpiar() })

        expect(result.current.resultado).toBeNull()
        expect(result.current.error).toBeNull()
    })
})
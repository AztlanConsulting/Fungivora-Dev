import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useEspecies from '../../../features/inoculos/hooks/useEspecies'
import inoculoService from '../../../features/inoculos/services/inoculo.service'

vi.mock('../../../features/inoculos/services/inoculo.service', () => {
    return {
        default: {
            getEspecies: vi.fn()
        }
    }
})

const especiesMock = [
    { especie: 'Shiitake' },
    { especie: 'Oyster' },
    { especie: 'Reishi' },
]

describe('useEspecies', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ─── Estado inicial ───────────────────────────────────────────────────────

    it('inicia con especies vacío, loading true y error null', () => {
        // Promesa que nunca resuelve para capturar el estado inicial
        inoculoService.getEspecies.mockReturnValue(new Promise(() => {}))

        const { result } = renderHook(() => useEspecies())

        expect(result.current.especies).toEqual([])
        expect(result.current.loading).toBe(true)
        expect(result.current.error).toBeNull()
    })

    // ─── Carga exitosa ────────────────────────────────────────────────────────

    it('guarda las especies y pone loading en false cuando el service responde con success', async () => {
        inoculoService.getEspecies.mockResolvedValue({
            success: true,
            data: especiesMock,
        })

        const { result } = renderHook(() => useEspecies())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.especies).toEqual(especiesMock)
        expect(result.current.error).toBeNull()
    })

    it('guarda especies vacío cuando el service responde con data vacío', async () => {
        inoculoService.getEspecies.mockResolvedValue({
            success: true,
            data: [],
        })

        const { result } = renderHook(() => useEspecies())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.especies).toEqual([])
        expect(result.current.error).toBeNull()
    })

    // ─── Respuesta sin éxito ──────────────────────────────────────────────────

    it('guarda el error cuando success es false', async () => {
        inoculoService.getEspecies.mockResolvedValue({
            success: false,
        })

        const { result } = renderHook(() => useEspecies())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBe('No se pudieron cargar las especies')
        expect(result.current.especies).toEqual([])
    })

    // ─── Error de conexión ────────────────────────────────────────────────────

    it('guarda el error cuando el service lanza una excepción', async () => {
        inoculoService.getEspecies.mockRejectedValue(new Error('Error de conexión'))

        const { result } = renderHook(() => useEspecies())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBe('Error de conexión')
        expect(result.current.especies).toEqual([])
    })
})
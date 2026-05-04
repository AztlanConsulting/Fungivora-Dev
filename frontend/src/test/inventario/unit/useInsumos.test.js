import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useInsumos from '../../../features/inventario/hooks/useInsumos'
import inventarioService from '../../../features/inventario/services/inventario.service'

vi.mock('../../../features/inventario/services/inventario.service', () => {
    return {
        default: {
            getInsumos: vi.fn()
        }
    }
})

const insumosMock = [
    { id_insumo: 1, nombre: 'Agua destilada', cantidad: 2000, unidad: 'ml', stock_recomendado: 200 },
    { id_insumo: 2, nombre: 'Peptona',         cantidad: 200,  unidad: 'g',  stock_recomendado: 200 },
]

describe('useInsumos', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ─── Estado inicial ───────────────────────────────────────────────────────

    it('inicia con insumos vacío, loading true y error null', () => {
        // Promesa que nunca resuelve para capturar el estado inicial
        inventarioService.getInsumos.mockReturnValue(new Promise(() => {}))

        const { result } = renderHook(() => useInsumos())

        expect(result.current.insumos).toEqual([])
        expect(result.current.loading).toBe(true)
        expect(result.current.error).toBeNull()
    })

    // ─── Carga exitosa ────────────────────────────────────────────────────────

    it('guarda los insumos y pone loading en false cuando el service responde con success', async () => {
        inventarioService.getInsumos.mockResolvedValue({
            success: true,
            data: insumosMock,
        })

        const { result } = renderHook(() => useInsumos())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.insumos).toEqual(insumosMock)
        expect(result.current.error).toBeNull()
    })

    it('guarda insumos vacío cuando el service responde con data vacío', async () => {
        inventarioService.getInsumos.mockResolvedValue({
            success: true,
            data: [],
        })

        const { result } = renderHook(() => useInsumos())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.insumos).toEqual([])
        expect(result.current.error).toBeNull()
    })

    // ─── Respuesta sin éxito ──────────────────────────────────────────────────

    it('guarda el error cuando success es false', async () => {
        inventarioService.getInsumos.mockResolvedValue({
            success: false,
        })

        const { result } = renderHook(() => useInsumos())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBe('No se pudieron cargar los insumos')
        expect(result.current.insumos).toEqual([])
    })

    // ─── Error de conexión ────────────────────────────────────────────────────

    it('guarda el error cuando el service lanza una excepción', async () => {
        inventarioService.getInsumos.mockRejectedValue(new Error('Error de conexión'))

        const { result } = renderHook(() => useInsumos())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBe('Error de conexión')
        expect(result.current.insumos).toEqual([])
    })
})
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useInoculoParaSemilla from '../../../features/inoculos/hooks/useInoculoprarasemillas'
import * as service from '../../../features/inoculos/services/inoculo.service'

// Mock del service
vi.mock('../../../features/inoculos/services/inoculo.service', () => ({
    fetchInoculosParaSemilla: vi.fn(),
}))

const inoculosMock = [
    {
        id_inoculo: 1,
        codigo_fungivora: 'AG-001',
        especie: 'Shiitake',
        tipo: 'Agar',
        cantidad_disponible: 500,
        unidad: 'ml',
        stock_recomendado: 200,
    },
    {
        id_inoculo: 2,
        codigo_fungivora: 'ML-001',
        especie: 'Shiitake',
        tipo: 'Medio Líquido',
        cantidad_disponible: 100,
        unidad: 'ml',
        stock_recomendado: 200,
    },
    {
        id_inoculo: 3,
        codigo_fungivora: 'AG-002',
        especie: 'Oyster',
        tipo: 'Agar',
        cantidad_disponible: 300,
        unidad: 'ml',
        stock_recomendado: 100,
    },
]

describe('useInoculoParaSemilla', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ─── Estado inicial ───────────────────────────────────────────────────────

    it('inicia con loading true y opciones vacías', () => {
        service.fetchInoculosParaSemilla.mockReturnValue(new Promise(() => {}))

        const { result } = renderHook(() => useInoculoParaSemilla(''))

        expect(result.current.loading).toBe(true)
        expect(result.current.opciones).toEqual([])
        expect(result.current.error).toBeNull()
    })

    // ─── Sin especie seleccionada ─────────────────────────────────────────────

    it('retorna opciones vacías cuando no hay especie seleccionada', async () => {
        service.fetchInoculosParaSemilla.mockResolvedValue(inoculosMock)

        const { result } = renderHook(() => useInoculoParaSemilla(''))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.opciones).toEqual([])
    })

    // ─── Carga exitosa con filtro por especie ─────────────────────────────────

    it('filtra los inóculos por la especie seleccionada', async () => {
        service.fetchInoculosParaSemilla.mockResolvedValue(inoculosMock)

        const { result } = renderHook(() => useInoculoParaSemilla('Shiitake'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        // Solo deben aparecer los de Shiitake
        expect(result.current.opciones).toHaveLength(2)
        expect(result.current.opciones[0].value).toBe(1)
        expect(result.current.opciones[1].value).toBe(2)
    })

    it('retorna opciones vacías si la especie no tiene inóculos disponibles', async () => {
        service.fetchInoculosParaSemilla.mockResolvedValue(inoculosMock)

        const { result } = renderHook(() => useInoculoParaSemilla('Reishi'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.opciones).toEqual([])
    })

    it('el label de cada opción incluye código, tipo, cantidad y unidad', async () => {
        service.fetchInoculosParaSemilla.mockResolvedValue(inoculosMock)

        const { result } = renderHook(() => useInoculoParaSemilla('Shiitake'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.opciones[0].label).toContain('AG-001')
        expect(result.current.opciones[0].label).toContain('Agar')
        expect(result.current.opciones[0].label).toContain('500')
        expect(result.current.opciones[0].label).toContain('ml')
    })

    // ─── Stock bajo ───────────────────────────────────────────────────────────

    it('marca stockBajo como true cuando cantidad <= stock_recomendado', async () => {
        service.fetchInoculosParaSemilla.mockResolvedValue(inoculosMock)

        const { result } = renderHook(() => useInoculoParaSemilla('Shiitake'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        // AG-001: 500 > 200 → stockBajo false
        expect(result.current.opciones[0].stockBajo).toBe(false)
        // ML-001: 100 <= 200 → stockBajo true
        expect(result.current.opciones[1].stockBajo).toBe(true)
    })

    it('raw contiene el objeto completo del inóculo', async () => {
        service.fetchInoculosParaSemilla.mockResolvedValue(inoculosMock)

        const { result } = renderHook(() => useInoculoParaSemilla('Shiitake'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.opciones[0].raw).toEqual(inoculosMock[0])
    })

    // ─── Error de conexión ────────────────────────────────────────────────────

    it('guarda el error cuando el service lanza una excepción', async () => {
        service.fetchInoculosParaSemilla.mockRejectedValue(new Error('Error de red'))

        const { result } = renderHook(() => useInoculoParaSemilla('Shiitake'))

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.error).toBe('No se pudieron cargar los inóculos disponibles.')
        expect(result.current.opciones).toEqual([])
    })
})
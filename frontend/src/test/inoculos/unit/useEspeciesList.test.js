import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useEspeciesList from '../../../features/inoculos/hooks/useEspeciesList'

// Mock del servicio
vi.mock('../../../features/inoculos/services/inoculo.service')
import inoculoService from '../../../features/inoculos/services/inoculo.service'

// Por simplicidad, usamos las abreviaciones
const especiesMock = [
    { opcion: 'HE' },
    { opcion: 'LE' },
    { opcion: 'PA' },
]

// Por simplicidad, usamos las abreviaciones
const especiesMapeadas = [
    { value: 'HE', label: 'HE' },
    { value: 'LE', label: 'LE' },
    { value: 'PA', label: 'PA' },
]

beforeEach(() => {
    vi.clearAllMocks()
})

// Estado inicial
describe('useEspeciesList — estado inicial', () => {
    it('inicia con especies como array vacío', () => {
        inoculoService.getAllEspecies.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useEspeciesList())
        expect(result.current.especies).toEqual([])
    })

    it('inicia con loading en true', () => {
        inoculoService.getAllEspecies.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useEspeciesList())
        expect(result.current.loading).toBe(true)
    })

    it('inicia con error en null', () => {
        inoculoService.getAllEspecies.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useEspeciesList())
        expect(result.current.error).toBeNull()
    })
})

// Carga exitosa
describe('useEspeciesList — carga exitosa', () => {
    it('mapea correctamente opcion a value y label', async () => {
        inoculoService.getAllEspecies.mockResolvedValue({ success: true, data: especiesMock })
        const { result } = renderHook(() => useEspeciesList())

        await act(async () => { })

        expect(result.current.especies).toEqual(especiesMapeadas)
    })

    it('pone loading en false al resolver', async () => {
        inoculoService.getAllEspecies.mockResolvedValue({ success: true, data: especiesMock })
        const { result } = renderHook(() => useEspeciesList())

        await act(async () => { })

        expect(result.current.loading).toBe(false)
    })

    it('deja error en null si la carga fue exitosa', async () => {
        inoculoService.getAllEspecies.mockResolvedValue({ success: true, data: especiesMock })
        const { result } = renderHook(() => useEspeciesList())

        await act(async () => { })

        expect(result.current.error).toBeNull()
    })

    it('devuelve array vacío si data viene vacío', async () => {
        inoculoService.getAllEspecies.mockResolvedValue({ success: true, data: [] })
        const { result } = renderHook(() => useEspeciesList())

        await act(async () => { })

        expect(result.current.especies).toEqual([])
    })
})

// Error 
describe('useEspeciesList — error', () => {
    it('guarda el mensaje de error cuando el servicio falla', async () => {
        inoculoService.getAllEspecies.mockRejectedValue(new Error('Error de red'))
        const { result } = renderHook(() => useEspeciesList())

        await act(async () => { })

        expect(result.current.error).toBe('Error de red')
    })

    it('pone loading en false aunque haya error', async () => {
        inoculoService.getAllEspecies.mockRejectedValue(new Error('Timeout'))
        const { result } = renderHook(() => useEspeciesList())

        await act(async () => { })

        expect(result.current.loading).toBe(false)
    })

    it('deja especies como array vacío si hubo error', async () => {
        inoculoService.getAllEspecies.mockRejectedValue(new Error('Fallo'))
        const { result } = renderHook(() => useEspeciesList())

        await act(async () => { })

        expect(result.current.especies).toEqual([])
    })
})
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useInoculoCard from '../../../features/inoculos/hooks/useInoculoCard'
import { TIPO_INOCULO_DEFAULT } from '../../../features/inoculos/types/inoculo.types'

// Mock del servicio
vi.mock('../../../features/inoculos/services/inoculo.service')
import inoculoService from '../../../features/inoculos/services/inoculo.service'

const datosMock = [
    {
        id_inoculo: 1,
        codigo_fungivora: 'PA-LE-2704',
        tipo: 'Agar',
        especie: 'Shiitake',
        fecha: '2026-04-27T06:00:00.000Z',
        cantidad_disponible: '100.00',
        unidad: 'gramos',
        stock_recomendado: '50.00',
    },
]

beforeEach(() => {
    vi.clearAllMocks()
})

// Estado inicial 

describe('useInoculoCard — estado inicial', () => {
    it('inicia con el tipo por defecto', () => {
        inoculoService.getDatosInoculo.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))
        expect(result.current.tipoSeleccionado).toBe(TIPO_INOCULO_DEFAULT)
    })

    it('inicia con datos como array vacío', () => {
        inoculoService.getDatosInoculo.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))
        expect(result.current.datos).toEqual([])
    })

    it('inicia con loading en true', () => {
        inoculoService.getDatosInoculo.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))
        expect(result.current.loading).toBe(true)
    })

    it('inicia con collapsed en false', () => {
        inoculoService.getDatosInoculo.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))
        expect(result.current.collapsed).toBe(false)
    })

    it('inicia con error en null', () => {
        inoculoService.getDatosInoculo.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))
        expect(result.current.error).toBeNull()
    })
})

// Carga de datos 

describe('useInoculoCard — carga de datos', () => {
    it('carga los datos al montar', async () => {
        inoculoService.getDatosInoculo.mockResolvedValue({ success: true, data: datosMock })

        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))

        await act(async () => { })

        expect(result.current.datos).toEqual(datosMock)
        expect(result.current.loading).toBe(false)
    })

    it('llama al servicio con la especie y tipo correctos', async () => {
        inoculoService.getDatosInoculo.mockResolvedValue({ success: true, data: [] })

        renderHook(() => useInoculoCard('Melena de León'))

        await act(async () => { })

        expect(inoculoService.getDatosInoculo).toHaveBeenCalledWith('Melena de León', TIPO_INOCULO_DEFAULT)
    })

    it('guarda el error cuando el servicio falla', async () => {
        inoculoService.getDatosInoculo.mockRejectedValue(new Error('Sin conexión'))

        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))

        await act(async () => { })

        expect(result.current.error).toBe('Sin conexión')
        expect(result.current.datos).toEqual([])
    })
})

// handleTipoChange 

describe('useInoculoCard — handleTipoChange', () => {
    it('actualiza el tipo seleccionado', async () => {
        inoculoService.getDatosInoculo.mockResolvedValue({ success: true, data: [] })

        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))

        await act(async () => { })

        await act(async () => { result.current.handleTipoChange('Semilla') })

        expect(result.current.tipoSeleccionado).toBe('Semilla')
    })

    it('vuelve a llamar al servicio con el nuevo tipo', async () => {
        inoculoService.getDatosInoculo.mockResolvedValue({ success: true, data: [] })

        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))

        await act(async () => { })

        await act(async () => { result.current.handleTipoChange('Medio Líquido') })

        expect(inoculoService.getDatosInoculo).toHaveBeenCalledWith('Seta Cardo', 'Medio Líquido')
    })
})

// toggleCollapse 

describe('useInoculoCard — toggleCollapse', () => {
    it('cambia collapsed de false a true', async () => {
        inoculoService.getDatosInoculo.mockResolvedValue({ success: true, data: [] })

        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))

        await act(async () => { })

        act(() => { result.current.toggleCollapse() })

        expect(result.current.collapsed).toBe(true)
    })

    it('cambia collapsed de true a false al llamarlo dos veces', async () => {
        inoculoService.getDatosInoculo.mockResolvedValue({ success: true, data: [] })

        const { result } = renderHook(() => useInoculoCard('Seta Cardo'))

        await act(async () => { })

        act(() => { result.current.toggleCollapse() })
        act(() => { result.current.toggleCollapse() })

        expect(result.current.collapsed).toBe(false)
    })
})
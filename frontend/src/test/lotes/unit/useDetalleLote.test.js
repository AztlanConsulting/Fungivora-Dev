import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useDetalleLote from '../../../features/lotes/hooks/useDetalleLote'

// Mock del servicio
vi.mock('../../../features/lotes/services/lote.service')
import { LoteService } from '../../../features/lotes/services/lote.service'

// Datos de prueba 
const bloquesMock = [
    { 
        id_bloque: 1, 
        estado: 'activo', 
        contaminado: false, 
        codigo_lote: 'INO-001', 
        especie_nombre: 'Pleurotus' 
    },
    { 
        id_bloque: 2, 
        estado: 'activo', 
        contaminado: false, 
        codigo_lote: 'INO-001', 
        especie_nombre: 'Pleurotus' 
    },
]

const ID_LOTE = 10
const FASE_INICIAL = 'Colonización'

beforeEach(() => {
    vi.clearAllMocks()
})

describe('useDetalleLote — estado inicial', () => {
    it('inicia con bloques como array vacío', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))
        expect(result.current.bloques).toEqual([])
    })

    it('inicia con cargando en true', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))
        expect(result.current.cargando).toBe(true)
    })

    it('inicia con error en null', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))
        expect(result.current.error).toBeNull()
    })

    it('inicia con especie como string vacío', () => {
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))
        expect(result.current.especie).toBe('')
    })

    it('inicia con codigoInoculo como null', () => {
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))
        expect(result.current.codigoInoculo).toBeNull()
    })

    it('calcula correctamente el índice de fase desde faseInicial', () => {
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, 'Colonización'))
        expect(result.current.fase).toBe(1)
    })

    it('usa fase 0 si faseInicial no coincide con ninguna fase conocida', () => {
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, 'FaseInexistente'))
        expect(result.current.fase).toBe(0)
    })

    it('expone el array completo de fases', () => {
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))
        expect(result.current.fases).toHaveLength(6)
        expect(result.current.fases[0].label).toBe('Inoculación')
    })
})

describe('useDetalleLote — carga exitosa', () => {
    it('carga los bloques correctamente', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.bloques).toEqual(bloquesMock)
    })

    it('carga el código de inóculo desde el primer bloque', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.codigoInoculo).toBe('INO-001')
    })

    it('carga la especie desde el primer bloque', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.especie).toBe('Pleurotus')
    })

    it('pone cargando en false al resolver', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.cargando).toBe(false)
    })

    it('usa array vacío si data de bloques viene undefined', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: undefined })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.bloques).toEqual([])
    })
})

describe('useDetalleLote — sin datos de inóculo', () => {
    it('mantiene valores iniciales si la lista de bloques está vacía', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: [] })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.codigoInoculo).toBeNull()
        expect(result.current.especie).toBe("")
    })

    it('usa "S/N" como especie si el bloque no tiene especie_nombre', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ 
            data: [{ id_bloque: 1, codigo_lote: 'TEST' }] 
        })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.especie).toBe('S/N')
    })
})

describe('useDetalleLote — error', () => {
    it('guarda el mensaje de error cuando el servicio falla', async () => {
        LoteService.getBloquesByLote.mockRejectedValue(new Error('Error de red'))
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.error).toBe('Error de red')
    })

    it('pone cargando en false aunque haya error', async () => {
        LoteService.getBloquesByLote.mockRejectedValue(new Error('Timeout'))
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await act(async () => { })
        expect(result.current.cargando).toBe(false)
    })
})

describe('useDetalleLote — guardarCambios', () => {
    it('llama a los servicios con los parámetros correctos', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.updateFaseLote.mockResolvedValue({})
        LoteService.updateBloquesMasivo.mockResolvedValue({})

        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))
        await act(async () => { })

        let respuesta
        await act(async () => {
            respuesta = await result.current.guardarCambios(bloquesMock, 2)
        })

        expect(LoteService.updateFaseLote).toHaveBeenCalledWith(ID_LOTE, 'Fructificación')
        expect(LoteService.updateBloquesMasivo).toHaveBeenCalledWith(ID_LOTE, bloquesMock)
        expect(respuesta.success).toBe(true)
    })
})
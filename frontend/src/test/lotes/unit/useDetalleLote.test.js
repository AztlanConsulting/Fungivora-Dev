import { renderHook, act, waitFor } from '@testing-library/react'
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
]

const ID_LOTE = 10
const FASE_INICIAL = 'Colonización'

beforeEach(() => {
    vi.clearAllMocks()
    LoteService.getBloquesByLote.mockResolvedValue({ data: [] })
    LoteService.getDetalleLote.mockResolvedValue({ fase: FASE_INICIAL })
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

    it('calcula correctamente el índice de fase desde la API/faseInicial', async () => {
        LoteService.getDetalleLote.mockResolvedValue({ fase: 'Colonización' })
        
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, 'Inoculación'))
        await waitFor(() => {
            expect(result.current.fase).toBe(1)
        })
    })

    it('usa fase 0 si la fase de la API no coincide con ninguna conocida', async () => {
        LoteService.getDetalleLote.mockResolvedValue({ fase: 'FaseInexistente' })
        
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, 'FaseInexistente'))
        
        await waitFor(() => {
            expect(result.current.fase).toBe(0)
        })
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

        await waitFor(() => {
            expect(result.current.bloques).toEqual(bloquesMock)
        })
    })

    it('carga el código de inóculo desde el primer bloque', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await waitFor(() => {
            expect(result.current.codigoInoculo).toBe('INO-001')
        })
    })

    it('pone cargando en false al resolver', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        const { result } = renderHook(() => useDetalleLote(ID_LOTE, FASE_INICIAL))

        await waitFor(() => {
            expect(result.current.cargando).toBe(false)
        })
    })
})

describe('useDetalleLote — guardarCambios', () => {
    it('llama a los servicios con los parámetros correctos', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.getDetalleLote.mockResolvedValue({ fase: 'Inoculación' })
        LoteService.updateFaseLote.mockResolvedValue({})
        LoteService.updateBloquesMasivo.mockResolvedValue({})

        const { result } = renderHook(() => useDetalleLote(ID_LOTE, 'Inoculación'))
        
        await waitFor(() => expect(result.current.cargando).toBe(false))

        let respuesta
        await act(async () => {
            respuesta = await result.current.guardarCambios(bloquesMock, 2)
        })

        expect(LoteService.updateFaseLote).toHaveBeenCalledWith(ID_LOTE, 'Fructificación')
        expect(LoteService.updateBloquesMasivo).toHaveBeenCalledWith(ID_LOTE, bloquesMock)
        expect(respuesta.success).toBe(true)
    })
})
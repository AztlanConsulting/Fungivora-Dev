import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useDetalleLote from '../../../features/lotes/hooks/useDetalleLote'

// Mock del servicio
vi.mock('../../../features/lotes/services/lote.service')
import { LoteService } from '../../../features/lotes/services/lote.service'

// Datos de prueba 

const bloquesMock = [
    { id_bloque: 1, estado: 'activo', contaminado: false },
    { id_bloque: 2, estado: 'activo', contaminado: false },
]

const ID_LOTE = 10
const ID_INOCULO = 5
const FASE_INICIAL = 'Colonización'

beforeEach(() => {
    vi.clearAllMocks()
})

// Estado inicial 

describe('useDetalleLote — estado inicial', () => {
    it('inicia con bloques como array vacío', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        LoteService.getCodigoInoculo.mockReturnValue(new Promise(() => { }))
        LoteService.getEspecieByLote.mockReturnValue(new Promise(() => { }))

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        expect(result.current.bloques).toEqual([])
    })

    it('inicia con cargando en true', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        LoteService.getCodigoInoculo.mockReturnValue(new Promise(() => { }))
        LoteService.getEspecieByLote.mockReturnValue(new Promise(() => { }))

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        expect(result.current.cargando).toBe(true)
    })

    it('inicia con error en null', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        LoteService.getCodigoInoculo.mockReturnValue(new Promise(() => { }))
        LoteService.getEspecieByLote.mockReturnValue(new Promise(() => { }))

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        expect(result.current.error).toBeNull()
    })

    it('inicia con especie como string vacío', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        LoteService.getCodigoInoculo.mockReturnValue(new Promise(() => { }))
        LoteService.getEspecieByLote.mockReturnValue(new Promise(() => { }))

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        expect(result.current.especie).toBe('')
    })

    it('inicia con codigoInoculo como string vacío', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        LoteService.getCodigoInoculo.mockReturnValue(new Promise(() => { }))
        LoteService.getEspecieByLote.mockReturnValue(new Promise(() => { }))

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        expect(result.current.codigoInoculo).toBe('')
    })

    it('calcula correctamente el índice de fase desde faseInicial', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        LoteService.getCodigoInoculo.mockReturnValue(new Promise(() => { }))
        LoteService.getEspecieByLote.mockReturnValue(new Promise(() => { }))

        // "Colonización" es el índice 1 en el array de fases
        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, 'Colonización')
        )

        expect(result.current.fase).toBe(1)
    })

    it('usa fase 0 si faseInicial no coincide con ninguna fase conocida', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        LoteService.getCodigoInoculo.mockReturnValue(new Promise(() => { }))
        LoteService.getEspecieByLote.mockReturnValue(new Promise(() => { }))

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, 'FaseInexistente')
        )

        expect(result.current.fase).toBe(0)
    })

    it('expone el array completo de fases', () => {
        LoteService.getBloquesByLote.mockReturnValue(new Promise(() => { }))
        LoteService.getCodigoInoculo.mockReturnValue(new Promise(() => { }))
        LoteService.getEspecieByLote.mockReturnValue(new Promise(() => { }))

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        expect(result.current.fases).toHaveLength(6)
        expect(result.current.fases[0].label).toBe('Inoculación')
        expect(result.current.fases[5].label).toBe('Finalización')
    })
})

// Carga exitosa 

describe('useDetalleLote — carga exitosa', () => {
    it('carga los bloques correctamente', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.bloques).toEqual(bloquesMock)
    })

    it('carga el código de inóculo correctamente', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.codigoInoculo).toBe('INO-001')
    })

    it('carga la especie correctamente', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.especie).toBe('Pleurotus')
    })

    it('pone cargando en false al resolver', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.cargando).toBe(false)
    })

    it('deja error en null si la carga fue exitosa', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.error).toBeNull()
    })

    it('usa array vacío si data de bloques viene undefined', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: undefined })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.bloques).toEqual([])
    })

    it('llama a getBloquesByLote con el id_lote correcto', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: [] })
        LoteService.getCodigoInoculo.mockResolvedValue('N/A')
        LoteService.getEspecieByLote.mockResolvedValue('S/N')

        renderHook(() => useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL))

        await act(async () => { })

        expect(LoteService.getBloquesByLote).toHaveBeenCalledWith(ID_LOTE)
    })
})

// Sin id_inoculo_usado 

describe('useDetalleLote — sin id_inoculo_usado', () => {
    it('usa "N/A" como codigoInoculo cuando no hay id_inoculo_usado', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, null, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.codigoInoculo).toBe('N/A')
    })

    it('usa "S/N" como especie cuando no hay id_inoculo_usado', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, null, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.especie).toBe('S/N')
    })

    it('no llama a getCodigoInoculo cuando id_inoculo_usado es null', async () => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: [] })

        renderHook(() => useDetalleLote(ID_LOTE, null, FASE_INICIAL))

        await act(async () => { })

        expect(LoteService.getCodigoInoculo).not.toHaveBeenCalled()
    })
})

// Sin id_lote 

describe('useDetalleLote — sin id_lote', () => {
    it('no llama a ningún servicio si id_lote es undefined', async () => {
        renderHook(() => useDetalleLote(undefined, ID_INOCULO, FASE_INICIAL))

        await act(async () => { })

        expect(LoteService.getBloquesByLote).not.toHaveBeenCalled()
        expect(LoteService.getCodigoInoculo).not.toHaveBeenCalled()
        expect(LoteService.getEspecieByLote).not.toHaveBeenCalled()
    })
})

// Error 

describe('useDetalleLote — error', () => {
    it('guarda el mensaje de error cuando el servicio falla', async () => {
        LoteService.getBloquesByLote.mockRejectedValue(new Error('Error de red'))
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.error).toBe('Error de red')
    })

    it('pone cargando en false aunque haya error', async () => {
        LoteService.getBloquesByLote.mockRejectedValue(new Error('Timeout'))
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.cargando).toBe(false)
    })

    it('deja bloques como array vacío si hubo error', async () => {
        LoteService.getBloquesByLote.mockRejectedValue(new Error('Fallo'))
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )

        await act(async () => { })

        expect(result.current.bloques).toEqual([])
    })
})

// getFase 

describe('useDetalleLote — getFase', () => {
    beforeEach(() => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: [] })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')
    })

    it('retorna el label correcto para un índice válido', async () => {
        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        expect(result.current.getFase(0)).toBe('Inoculación')
        expect(result.current.getFase(2)).toBe('Fructificación')
        expect(result.current.getFase(5)).toBe('Finalización')
    })

    it('retorna "Desconocida" para un índice fuera de rango', async () => {
        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        expect(result.current.getFase(99)).toBe('Desconocida')
    })
})

// guardarCambios 

describe('useDetalleLote — guardarCambios', () => {
    beforeEach(() => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')
    })

    it('retorna { success: true } cuando ambas actualizaciones tienen éxito', async () => {
        LoteService.updateFaseLote.mockResolvedValue({})
        LoteService.updateBloquesMasivo.mockResolvedValue({})

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        let respuesta
        await act(async () => {
            respuesta = await result.current.guardarCambios(bloquesMock, 2)
        })

        expect(respuesta).toEqual({ success: true })
    })

    it('llama a updateFaseLote con el id_lote y la fase correcta', async () => {
        LoteService.updateFaseLote.mockResolvedValue({})
        LoteService.updateBloquesMasivo.mockResolvedValue({})

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        await act(async () => {
            await result.current.guardarCambios(bloquesMock, 2)
        })

        // Índice 2 → "Fructificación"
        expect(LoteService.updateFaseLote).toHaveBeenCalledWith(ID_LOTE, 'Fructificación')
    })

    it('llama a updateBloquesMasivo con el id_lote y los bloques correctos', async () => {
        LoteService.updateFaseLote.mockResolvedValue({})
        LoteService.updateBloquesMasivo.mockResolvedValue({})

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        await act(async () => {
            await result.current.guardarCambios(bloquesMock, 2)
        })

        expect(LoteService.updateBloquesMasivo).toHaveBeenCalledWith(ID_LOTE, bloquesMock)
    })

    it('usa "Inoculación" si el índice de fase no existe en el array', async () => {
        LoteService.updateFaseLote.mockResolvedValue({})
        LoteService.updateBloquesMasivo.mockResolvedValue({})

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        await act(async () => {
            await result.current.guardarCambios(bloquesMock, 99)
        })

        expect(LoteService.updateFaseLote).toHaveBeenCalledWith(ID_LOTE, 'Inoculación')
    })

    it('retorna { success: false, error } cuando falla updateFaseLote', async () => {
        LoteService.updateFaseLote.mockRejectedValue(new Error('Error al guardar fase'))
        LoteService.updateBloquesMasivo.mockResolvedValue({})

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        let respuesta
        await act(async () => {
            respuesta = await result.current.guardarCambios(bloquesMock, 1)
        })

        expect(respuesta).toEqual({ success: false, error: 'Error al guardar fase' })
    })

    it('retorna { success: false, error } cuando falla updateBloquesMasivo', async () => {
        LoteService.updateFaseLote.mockResolvedValue({})
        LoteService.updateBloquesMasivo.mockRejectedValue(new Error('Error al guardar bloques'))

        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        let respuesta
        await act(async () => {
            respuesta = await result.current.guardarCambios(bloquesMock, 1)
        })

        expect(respuesta).toEqual({ success: false, error: 'Error al guardar bloques' })
    })
})

// setBloques / setFase (setters expuestos) 

describe('useDetalleLote — setters expuestos', () => {
    beforeEach(() => {
        LoteService.getBloquesByLote.mockResolvedValue({ data: bloquesMock })
        LoteService.getCodigoInoculo.mockResolvedValue('INO-001')
        LoteService.getEspecieByLote.mockResolvedValue('Pleurotus')
    })

    it('setBloques actualiza el estado de bloques', async () => {
        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        const nuevoBloques = [{ id_bloque: 99, estado: 'inactivo' }]

        act(() => {
            result.current.setBloques(nuevoBloques)
        })

        expect(result.current.bloques).toEqual(nuevoBloques)
    })

    it('setFase actualiza el estado de fase', async () => {
        const { result } = renderHook(() =>
            useDetalleLote(ID_LOTE, ID_INOCULO, FASE_INICIAL)
        )
        await act(async () => { })

        act(() => {
            result.current.setFase(4)
        })

        expect(result.current.fase).toBe(4)
    })
})
import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Lotes } from '../../../pages'

// Mocks de ui 
vi.mock('../../shared/components/ui/basics/titulo', () => ({
    default: ({ children }) => <h1>{children}</h1>
}))
vi.mock('../../shared/components/layout/base', () => ({
    default: ({ children }) => <div data-testid="base-layout">{children}</div>
}))

// Mock de los datos
const mockData = {
    success: true,
    data: [
        {
            id_lote: 1,
            codigo_fungivora: 'LOTE-001',
            tipo_sustrato: 'Paja de Trigo',
            ubicacion_lote: 'Estante A1',
            fase: 'Inoculación',
            fecha_lote: '2024-03-20T10:00:00Z'
        }
    ]
}

describe('Componente de tabla Lotes', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.useRealTimers()
    })

    const setupFetchResponse = (data) => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(data),
        })
    }

    it('Mostrar los datos del lote ', async () => {
        setupFetchResponse(mockData)

        render(<Lotes />)

        const codigos = await screen.findAllByText(/LOTE-001/i)
        expect(codigos[0]).toBeInTheDocument()
        
        const sustratos = screen.getAllByText(/Paja de Trigo/i)
        expect(sustratos.length).toBeGreaterThan(0)
    })

    it('Refrescar automáticamente en 5 segundos', async () => {
        setupFetchResponse(mockData)

        render(<Lotes />)

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

        // Avanzar 5 segs
        await act(async () => {
            vi.advanceTimersByTime(5000)
        })

        expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('No hay filas si es false', async () => {
        // Respuesta fallida
        setupFetchResponse({ success: false, data: [] })

        render(<Lotes />)

        // No deben aparecer lotes
        await waitFor(() => {
            expect(screen.queryByText('LOTE-001')).not.toBeInTheDocument()
        })
    })
})
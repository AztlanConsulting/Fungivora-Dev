import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Lotes } from '../../../pages'

// Mocks de ui
vi.mock('../../shared/components/ui/basics/titulo', () => ({
    default: ({ children }) => <h1>{children}</h1>
}))
vi.mock('../../shared/components/ui/basics/texto', () => ({
    default: ({ children }) => <span>{children}</span>
}))
vi.mock('../../shared/components/layout/base', () => ({
    default: ({ children }) => <div>{children}</div>
}))

// Mock de datos para la API
const mockLotes = {
    success: true,
    data: [
        {
            id_lote: 1,
            codigo_fungivora: "LOTE-001",
            tipo_sustrato: "Paja",
            ubicacion_lote: "Estante A",
            fase: "Cosecha",
            fecha_lote: "2024-01-01T10:00:00Z"
        },
        {
            id_lote: 2,
            codigo_fungivora: "LOTE-002",
            tipo_sustrato: "Aserrín",
            ubicacion_lote: "Estante B",
            fase: "Inoculación",
            fecha_lote: "2024-01-05T10:00:00Z"
        }
    ]
}

describe('Vista Lotes', () => {

    beforeEach(() => {
        // Un timer falso para el refresh
        vi.useFakeTimers({ shouldAdvanceTime: true }) 
        global.fetch = vi.fn()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    it('Carga y muestra los lotes', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockLotes,
        })

        render(<Lotes />)
        const codigos = await screen.findAllByText(/LOTE-002/i)

        expect(codigos.length).toBeGreaterThan(0)
        expect(codigos[0]).toBeInTheDocument()
        expect(screen.getAllByText(/Paja/i)[0]).toBeInTheDocument()
        expect(screen.getAllByText(/Aserrín/i)[0]).toBeInTheDocument()
    })

    it('Ordena los lotes por fecha', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockLotes,
        })

        render(<Lotes />)
        const elementos = await screen.findAllByText(/LOTE-/i)

        expect(elementos[0].textContent).toContain("LOTE-002")
    })

    it('Refrescar automáticamente cada 5 segundos', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockLotes,
        })

        render(<Lotes />)

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
        await act(async () => {
            vi.advanceTimersByTime(5000) // avanzar el tiempo esos 5 segs
        })

        expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('Selecciona una fila', async () => {
        const user = userEvent.setup({ delay: null })
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockLotes,
        })

        render(<Lotes />)

        const filas = await screen.findAllByText("LOTE-001")
        const filaMovil = filas[0].closest('.md\\:hidden')
        
        await user.click(filaMovil) // Hacer un click en el recuadro
        expect(filaMovil).toHaveClass('ring-2')
    })
})
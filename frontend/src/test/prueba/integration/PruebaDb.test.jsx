import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PruebaDb } from '../../../pages'

// Mock del hook para controlar el comportamiento desde afuera
vi.mock('../../../features/ejemplo/hooks/usePruebaDb')
import usePruebaDb from '../../../features/ejemplo/hooks/usePruebaDb'

// Mock de componentes UI
vi.mock('../../../shared/components/ui', () => ({
    Titulo: ({ children }) => <h1>{children}</h1>,
    Text: ({ children }) => <p>{children}</p>,
    Botones: ({ children, onClick }) => (
        <button onClick={onClick}>{children}</button>
    ),
}))

// ─── Estado base del hook ─────────────────────────────────────────────

const hookBase = {
    resultado: null,
    cargando: false,
    error: null,
    ejecutar: vi.fn(),
    limpiar: vi.fn(),
}

beforeEach(() => {
    vi.clearAllMocks()
    usePruebaDb.mockReturnValue(hookBase)
})

// ─── Tests ────────────────────────────────────────────────────────────

describe('PruebaDb — integración página completa', () => {
    it('renderiza la página sin errores', () => {
        render(<PruebaDb />)
        expect(screen.getByText('Prueba')).toBeInTheDocument()
    })

    it('flujo completo: click ejecutar → cargando → resultado', async () => {
        const user = userEvent.setup()
        const ejecutar = vi.fn()

        // Primer render: estado inicial
        usePruebaDb.mockReturnValue({ ...hookBase, ejecutar })
        const { rerender } = render(<PruebaDb />)

        await user.click(screen.getByText('Ejecutar prueba'))
        expect(ejecutar).toHaveBeenCalledTimes(1)

        // Segundo render: cargando
        usePruebaDb.mockReturnValue({ ...hookBase, cargando: true, ejecutar })
        rerender(<PruebaDb />)
        expect(screen.getByText('Ejecutando prueba...')).toBeInTheDocument()

        // Tercer render: resultado recibido
        usePruebaDb.mockReturnValue({
            ...hookBase,
            ejecutar,
            resultado: {
                status: 'success',
                tiempo_respuesta: '42ms',
                datos_recuperados: 100,
            },
        })
        rerender(<PruebaDb />)

        await waitFor(() => {
            expect(screen.getByText('success')).toBeInTheDocument()
            expect(screen.getByText('42ms')).toBeInTheDocument()
            expect(screen.getByText('100')).toBeInTheDocument()
        })
    })

    it('flujo de error: click ejecutar → muestra error', async () => {
        const user = userEvent.setup()
        const ejecutar = vi.fn()

        usePruebaDb.mockReturnValue({ ...hookBase, ejecutar })
        const { rerender } = render(<PruebaDb />)

        await user.click(screen.getByText('Ejecutar prueba'))

        usePruebaDb.mockReturnValue({
            ...hookBase,
            ejecutar,
            error: 'Connection lost',
        })
        rerender(<PruebaDb />)

        expect(screen.getByText('Error: Connection lost')).toBeInTheDocument()
    })

    it('flujo limpiar: resultado visible → click limpiar → desaparece', async () => {
        const user = userEvent.setup()
        const limpiar = vi.fn()

        usePruebaDb.mockReturnValue({
            resultado: {
                status: 'success',
                tiempo_respuesta: '20ms',
                datos_recuperados: 50,
            },
            cargando: false,
            error: null,
            ejecutar: vi.fn(),
            limpiar,
        })

        const { rerender } = render(<PruebaDb />)

        expect(screen.getByText('success')).toBeInTheDocument()

        await user.click(screen.getByText('Limpiar'))
        expect(limpiar).toHaveBeenCalledTimes(1)

        usePruebaDb.mockReturnValue({
            resultado: null,
            cargando: false,
            error: null,
            ejecutar: vi.fn(),
            limpiar,
        })

        rerender(<PruebaDb />)

        expect(screen.queryByText('success')).not.toBeInTheDocument()
    })
})
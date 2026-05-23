import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Barra_navegacion from '../../../shared/components/layout/BarraNavegacion'

// Mock de los componentes
vi.mock('../../../shared/components/ui/popups/ModalConfirmacion', () => ({
    default: ({ visible, titulo, onConfirm, onCancel }) => {
        if (!visible) return null;
        return (
            <div data-testid="modal-confirmacion">
                <h1>{titulo}</h1>
                <button onClick={onConfirm}>Confirmar</button>
                <button onClick={onCancel}>Cancelar</button>
            </div>
        );
    }
}));

vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <div data-testid="icon" />
}))

// Mock del logo
vi.mock('/icons/icon-splash-blue.png?url', () => ({ default: 'logo-mock' }))

describe('Pruebas de Logout - Resultado', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
        vi.spyOn(Storage.prototype, 'removeItem')
    })

    const renderBarra = () => render(
        <BrowserRouter>
            <Barra_navegacion />
        </BrowserRouter>
    )

    it('Abrir el modal', async () => {
        const user = userEvent.setup()
        renderBarra()

        const botonAbrir = screen.getByText(/Cerrar sesión/i).closest('button')
        await user.click(botonAbrir)
        const modal = await screen.findByTestId('modal-confirmacion')
        expect(modal).toBeInTheDocument()
    })

    it('Confirmar cierre', async () => {
        const user = userEvent.setup()
        localStorage.setItem('token', 'token-de-prueba')
        renderBarra()

        await user.click(screen.getByText(/Cerrar sesión/i).closest('button'))
        const botonConfirmar = screen.getByRole('button', { name: /confirmar/i })
        await user.click(botonConfirmar)

        expect(localStorage.removeItem).toHaveBeenCalledWith('token')
        expect(localStorage.getItem('token')).toBeNull()
        expect(window.location.pathname).toBe('/')
    })

    it('Cancelar el cierre', async () => {
        const user = userEvent.setup()
        localStorage.setItem('token', 'token-valido')
        renderBarra()

        await user.click(screen.getByText(/Cerrar sesión/i).closest('button'))
        const botonCancelar = screen.getByRole('button', { name: /cancelar/i })
        await user.click(botonCancelar)

        expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
        expect(localStorage.getItem('token')).toBe('token-valido')
    })
})
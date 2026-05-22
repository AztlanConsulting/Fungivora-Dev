import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Barra_navegacion from '../../../shared/components/layout/BarraNavegacion'

// Mock del icono
vi.mock('/icons/icon-splash-blue.png', () => ({ default: 'logo-mock' }))

// Mock del modal
vi.mock('../ui/popups/modal_confirmacion', () => ({
    default: ({ visible, onConfirm, onCancel, titulo }) => (
        visible ? (
            <div data-testid="modal-mock">
                <h1>{titulo}</h1>
                <button onClick={onConfirm}>Confirmar</button>
                <button onClick={onCancel}>Cancelar</button>
            </div>
        ) : null
    )
}))

// Mock de iconos
vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <div data-testid="icon" />
}))

describe('Pruebas de Logout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
        vi.spyOn(Storage.prototype, 'removeItem')
    })

    it('Limpiar el token y navegar al login', async () => {
        const user = userEvent.setup()
        localStorage.setItem("token", "token-existente")

        render(
            <BrowserRouter>
                <Barra_navegacion />
            </BrowserRouter>
        )

        // Abrir modal
        const botonLogout = screen.getByRole('button', { name: /cerrar sesión/i })
        await user.click(botonLogout)

        // Confirmar
        const botonConfirmar = screen.getByRole('button', { name: /confirmar/i })
        await user.click(botonConfirmar)

        // Verificaciones
        expect(localStorage.removeItem).toHaveBeenCalledWith("token")
        expect(localStorage.getItem("token")).toBeNull()
        expect(window.location.pathname).toBe('/')
    })
})
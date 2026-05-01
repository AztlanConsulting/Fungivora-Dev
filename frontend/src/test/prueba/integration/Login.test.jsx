import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from '../Login'
import useLogin from '../../hooks/useLogin'

// Mock del hook
vi.mock('../../hooks/useLogin')

describe('Login — Integración Página', () => {
    const mockEjecutarLogin = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        useLogin.mockReturnValue({
            ejecutarLogin: mockEjecutarLogin,
            cargando: false,
            error: null
        })
    })

    it('llama a ejecutarLogin con los datos del formulario', async () => {
        const user = userEvent.setup()
        render(<Login />)

        await user.type(screen.getByPlaceholderText(/Escribe tu usuario/i), 'marcos')
        await user.type(screen.getByPlaceholderText(/Escribe tu contraseña/i), 'pass123')
        await user.click(screen.getByText('Entrar'))

        expect(mockEjecutarLogin).toHaveBeenCalledWith('marcos', 'pass123')
    })

    it('muestra mensaje de error cuando el hook devuelve un error', () => {
        useLogin.mockReturnValue({
            ejecutarLogin: mockEjecutarLogin,
            cargando: false,
            error: 'Error de conexión'
        })

        render(<Login />)
        expect(screen.getByText('Error de conexión')).toBeInTheDocument()
    })

    it('deshabilita o muestra estado de carga (opcional)', () => {
        useLogin.mockReturnValue({
            ejecutarLogin: mockEjecutarLogin,
            cargando: true,
            error: null
        })
        
        render(<Login />)
        // Aquí podrías verificar si el botón cambia de texto o se deshabilita
    })
})
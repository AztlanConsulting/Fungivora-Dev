import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Login } from '../../../pages' // Ruta corregida
import useLogin from '../../../features/hooks/useLogin' // Ruta corregida

vi.mock('../../../features/hooks/useLogin') // Debe coincidir con el import
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
        // 1. Renderizamos y extraemos container para búsquedas manuales si fallan los roles
        const { container } = render(<Login />)
        const user = userEvent.setup()

        // 2. Buscamos los inputs. 
        // Como tu componente Input renderiza un <input> real dentro, 
        // podemos buscarlos por su tipo o posición.
        const inputs = container.querySelectorAll('input');
        const inputUsuario = inputs[0]; // El primero es el de usuario
        const inputPassword = inputs[1]; // El segundo es el de contraseña

        // 3. Interactuamos
        await user.type(inputUsuario, 'marcos')
        await user.type(inputPassword, 'pass123')
        
        // 4. Click en el botón
        const boton = screen.getByRole('button', { name: /entrar/i })
        await user.click(boton)

        // 5. Verificación
        expect(mockEjecutarLogin).toHaveBeenCalledWith('marcos', 'pass123')
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
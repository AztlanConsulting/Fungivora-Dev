import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Login } from '../../../pages'
import useLogin from "../../../features/login/hooks/useLogin"

vi.mock('../../../features/login/hooks/useLogin', () => ({
    default: vi.fn(() => ({
        ejecutarLogin: vi.fn(),
        cargando: false,
        error: null
    }))
}))

// Mocks de UI
vi.mock('../../../shared/components/ui/inputs/InputTexto', () => ({
    default: (props) => <input {...props} />
}))

vi.mock('../../../shared/components/ui/buttons/Botones', () => ({
    default: ({ children, disabled, type }) => (
        <button disabled={disabled} type={type}>{children}</button>
    )
}))

vi.mock('../../../shared/components/ui/basics/Texto', () => ({
    default: ({ children }) => <span>{children}</span>
}))

// Mocks de assets e iconos
vi.mock('../../../assets/images/fondo-fungivora.png', () => ({ default: '' }))
vi.mock('../../../assets/images/fondo-fungivora-plano.png', () => ({ default: '' }))
vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <div data-testid="icon" />
}))

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Login — Pruebas completas', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        delete window.location
        window.location = { href: vi.fn() }
    })

    it('Flujo completo', async () => {
        const user = userEvent.setup()
        const mockEjecutarLogin = vi.fn().mockResolvedValue(true)

        vi.mocked(useLogin).mockReturnValue({
            ejecutarLogin: mockEjecutarLogin,
            cargando: false,
            error: null
        })

        renderWithRouter(<Login />)

        const inputUsuario = screen.getByPlaceholderText(/Escribe tu usuario/i)
        const inputPassword = screen.getByPlaceholderText(/Escribe tu contraseña/i)

        await user.type(inputUsuario, 'Eli')
        await user.type(inputPassword, '123')

        const boton = screen.getByRole('button', { name: /entrar/i })
        await user.click(boton)
        expect(mockEjecutarLogin).toHaveBeenCalledWith('Eli', '123')
        
        expect(window.location.href).toBe('/home')
    })

    it('Mensajes de error (401, 500, etc)', async () => {
        
        vi.mocked(useLogin).mockReturnValue({
            ejecutarLogin: vi.fn(),
            cargando: false,
            error: "Usuario y/o contraseña incorrectos"
        })

        renderWithRouter(<Login />)
        const errorMsg = screen.getByText(/Usuario y\/o contraseña incorrectos/i)
        expect(errorMsg).toBeInTheDocument()
    })

    it('Mensajes sin conexión', async () => {
        vi.mocked(useLogin).mockReturnValue({
            ejecutarLogin: vi.fn(),
            cargando: false,
            error: "Error de red: Inténtelo más tarde"
        })

        renderWithRouter(<Login />)

        const errorMsg = screen.getByText(/Error de red: Inténtelo más tarde/i)
        expect(errorMsg).toBeInTheDocument()
    })

    it('Botón deshabilitado al cargar', async () => {
        vi.mocked(useLogin).mockReturnValue({
            ejecutarLogin: vi.fn(),
            cargando: true,
            error: null
        })

        renderWithRouter(<Login />)

        const botonCargando = screen.getByRole('button', { name: /entrando/i })
        expect(botonCargando).toBeDisabled()
    })
})
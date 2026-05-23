import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Login } from '../../../pages'

// Mantenemos tus mocks de archivos tal cual los tienes
vi.mock('../../../features/login/hooks/useLogin')
import usePruebaDb from '../../../features/login/hooks/useLogin'

// Mocks de ui
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


// Mocks de assets e iconos para evitar errores de carga
vi.mock('../../../assets/images/fondo_fungivora.png', () => ({ default: '' }))
vi.mock('../../../assets/images/fondo_fungivora_plano.png', () => ({ default: '' }))
vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <div data-testid="icon" />
}))

// Render de las vistas
const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Login — Pruebas completas', () => {

    beforeEach(() => {
        global.fetch = vi.fn()
        vi.clearAllMocks()
        localStorage.clear()
        delete window.location
        window.location = { href: vi.fn() }
    })

    it('Flujo completo', async () => {
        const user = userEvent.setup()

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'token-secreto-123' }),
        })

        renderWithRouter(<Login />)

        const inputUsuario = screen.getByPlaceholderText(/Escribe tu usuario/i)
        const inputPassword = screen.getByPlaceholderText(/Escribe tu contraseña/i)

        await user.type(inputUsuario, 'Eli')
        await user.type(inputPassword, '123')

        const boton = screen.getByRole('button', { name: /entrar/i })
        await user.click(boton)

        expect(fetch).toHaveBeenCalledWith("/api/login", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
                nombre_usuario: "Eli",
                contrasena: "123",
            }),
        }))

        await waitFor(() => {
            expect(localStorage.getItem("token")).toBe('token-secreto-123')
        })
    })

    // Diferentes mensajes cuando el flujo no es exitoso
    it('Mensajes de error (401, 500, etc)', async () => {
        const user = userEvent.setup()

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ msg: "Error de base de datos" }),
        })

        renderWithRouter(<Login />)

        const inputUsuario = screen.getByPlaceholderText(/Escribe tu usuario/i)
        await user.type(inputUsuario, 'Eli')

        const boton = screen.getByRole('button', { name: /entrar/i })
        await user.click(boton)

        const errorMsg = await screen.findByText(/Usuario y\/o contraseña incorrectos/i)
        expect(errorMsg).toBeInTheDocument()
    })

    // Si en algun momento no hay conexión, aun hay mensajes de error
    it('Mensajes sin conexión', async () => {
        const user = userEvent.setup()

        fetch.mockRejectedValueOnce(new Error("Network Error"))

        renderWithRouter(<Login />)

        const inputUsuario = screen.getByPlaceholderText(/Escribe tu usuario/i)
        await user.type(inputUsuario, 'Eli')

        const boton = screen.getByRole('button', { name: /entrar/i })
        await user.click(boton)

        const errorMsg = await screen.findByText(/Usuario y\/o contraseña incorrectos/i)
        expect(errorMsg).toBeInTheDocument()
    })

    // Una vez el botón fue clickeado, cargará y no se puede volver a clickear
    it('Botón deshabilitado al cargar', async () => {
        const user = userEvent.setup()
        fetch.mockReturnValue(new Promise(() => { }))

        renderWithRouter(<Login />)

        const inputUsuario = screen.getByPlaceholderText(/Escribe tu usuario/i)
        await user.type(inputUsuario, 'Eli')
        await user.click(screen.getByRole('button', { name: /entrar/i }))

        const botonCargando = screen.getByRole('button', { name: /entrando/i })
        expect(botonCargando).toBeDisabled()
    })
})
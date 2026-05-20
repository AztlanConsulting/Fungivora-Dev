import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Usuario from '../../../pages/users/Usuario.jsx'
import userEvent from '@testing-library/user-event'

// Mocks 

vi.mock('../../../shared/components/ui/basics/Titulo', () => ({
    default: ({ children }) => <h1>{children}</h1>,
}))
vi.mock('../../../shared/components/layout/base', () => ({
    default: ({ children }) => <div>{children}</div>,
}))
vi.mock('../../../shared/components/ui/buttons/botones', () => ({
    default: ({ children, disabled, isOutline, onClick, ...props }) => (
        <button disabled={disabled} onClick={onClick} {...props}>{children}</button>
    )
}))

vi.mock('../../../features/user/components/TablaUsuarios', () => ({
    default: ({ datos, onEliminar }) => (
        <div data-testid="tabla-usuarios">
            {datos?.map?.((usuario) => (
                <div key={usuario.id_usuario}>
                    <span>{usuario.nombre_usuario}</span>
                    <button 
                        onClick={() => onEliminar(usuario.id_usuario)}
                        data-testid={`btn-eliminar-${usuario.id_usuario}`}
                    >
                        Eliminar
                    </button>
                </div>
            ))}
        </div>
    )
}))
vi.mock('../../../shared/components/ui/popups/modal_confirmacion', () => ({
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
vi.mock('../../../shared/components/ui/popups/ModalAlerta', () => ({
    default: ({ visible, mensaje, variante }) => {
        if (!visible) return null;
        return (
            <div data-testid="modal-alerta" data-variante={variante}>
                {mensaje}
            </div>
        );
    }
}));

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = vi.fn()
    localStorage.setItem('token', 'header.eyJpZCI6MX0.signature');

    
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ msg: 'Autorizado' }),
    })
    
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
    })
})

afterEach(() => {
    vi.restoreAllMocks()
}) 

const renderVista = () =>
    render(
        <MemoryRouter>
            <Usuario/>
        </MemoryRouter>
    )

//Describe los casos de Renderiza la vista
describe('Usuario  — renderizado base', () => {
    //Caso donde se muestra el titulo
    it('muestra el título de la vista', async () => {
        renderVista()
        await waitFor(() => {
            expect(screen.getByText('Usuarios')).toBeInTheDocument()
        })
    })

    //Caso donde se muestra la tabla de usuario
    it('muestra la tabla de usuarios', async () => {
        renderVista()
        await waitFor(() => {
            expect(screen.getByTestId('tabla-usuarios')).toBeInTheDocument()
        })
    })

    //Caso donde muestra el boton de adgregar
    it('muestra el boton de Agregar', async () => {
        renderVista()
        await waitFor(() => {
            expect(screen.getByText('Agregar')).toBeInTheDocument()
        })
    })

    //Caso donde NO se muestra el modal desde el inicio
    it('no muestra el modal al inicio', async() => {
        renderVista()
        await waitFor(() => {
            expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
        })
    })

    //Caso donde NO se muestra alguna alerta desde el inicio (en caso de que no exista alguna aletra presente)
    it('no muestra el modal de alerta al inicio', async () => {
        renderVista()
        await waitFor(() => {
            expect(screen.queryByTestId('modal-alerta')).not.toBeInTheDocument()
        })
    })
})

//describe todos los casos de las Redirecciones
describe('usuarios - redirecciones', () => {

    //Caaso donde si no hay token manda a login
    it('redirige a /login si no existe token', async () =>{
        localStorage.clear()
        renderVista()

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
        })
    })

    //Caso donde si no es un usuario autorizado, manda a la homepage
    it('redirige a /first si no es autorizado', async () =>{
        fetch.mockReset()
        fetch.mockRejectedValueOnce((new Error("No atorizado")))
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        })

        renderVista()
        
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/first')
        })
    })
})

//Describe los casos del Flujo de eliminación
describe('Usuario — flujo de eliminación', () => {

    const setupFetchConUsuarios = () => {
        fetch.mockReset()
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ msg: 'Autorizado'})
        })
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id_usuario: 1, nombre_usuario: 'Activo', correo_usuario: 'activo@test.com' },
                { id_usuario: 2, nombre_usuario: 'Inactivo', correo_usuario: 'inactivo@test.com' }
            ]
        })
    }

    //caso de alerta al intentar eliminarse a si mismo
    it('muestra alerta al intentar eliminarse a si mismo', async () => {
        setupFetchConUsuarios()
        const user = userEvent.setup()
        renderVista()

        await screen.findByText('Activo')
        await user.click(screen.getByTestId('btn-eliminar-1'))

        expect(screen.getByTestId('modal-alerta')).toBeInTheDocument()
        expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
    })

    //Caso de cancelar cierra el modal
    it('cierra el modal al cancelar', async () => {
        setupFetchConUsuarios()
        const user = userEvent.setup()
        renderVista()

        await screen.findByText('Inactivo')
        await user.click(screen.getByTestId('btn-eliminar-2'))
        await user.click(screen.getByText('Cancelar'))

        expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
    })

    //Caso de confirmar muestra alerta de exito
    it('muestra alerta de exito al confirmar', async () => {
        setupFetchConUsuarios()
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ ok: true, mensaje: 'Usuario eliminado' })
        })

        const user = userEvent.setup()
        renderVista()
        
        await screen.findByText('Inactivo')
        await user.click(screen.getByTestId('btn-eliminar-2'))
        await user.click(screen.getByText('Confirmar'))

        await waitFor(() => {
            expect(screen.getByTestId('modal-alerta')).toHaveAttribute('data-variante', 'exito')
        })
    })

    //Caso de confirmar con error muestra alerta de error
    it('muestra alerta de error si falla', async () => {
        setupFetchConUsuarios()
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ ok: false, mensaje: 'Error' })
        })

        const user = userEvent.setup()
        renderVista()
        
        await screen.findByText('Inactivo')
        await user.click(screen.getByTestId('btn-eliminar-2'))
        await user.click(screen.getByText('Confirmar'))

        await waitFor(() => {
            expect(screen.getByTestId('modal-alerta')).toHaveAttribute('data-variante', 'error')
        })
    })
})
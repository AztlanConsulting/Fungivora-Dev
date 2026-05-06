import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import RegistrarUsuario from '../../../pages/users/RegistrarUsuario.jsx'
// Mocks 

vi.mock('../../../shared/components/ui/basics/titulo', () => ({
    default: ({ children }) => <h1>{children}</h1>,
}))
vi.mock('../../../shared/components/layout/base', () => ({
    default: ({ children }) => <div>{children}</div>,
}))
vi.mock('../../../shared/components/ui/basics/texto', () => ({
    default: ({ children }) => <p>{children}</p>,
}))
vi.mock('../../../shared/components/ui/inputs/input_texto', () => ({
    default: (props) => <input {...props} />,
}))
vi.mock('../../../shared/components/ui/buttons/botones', () => ({
    default: ({ children, disabled, isOutline, ...props }) => (
        <button disabled={disabled} {...props}>{children}</button>
    )
}))
vi.mock('../../../shared/components/ui/basics/error', () => ({
    default: ({ detalle }) => detalle ? <p>{detalle}</p> : null,
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

//--------------Mock de useNavagate-------------------------

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = vi.fn()
    localStorage.setItem('token', 'test-token');
     fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ msg: 'Autorizado'}),
     })
    })

afterEach(() => {
    vi.restoreAllMocks()
}) 

const renderVista = () =>
    render(
        <MemoryRouter>
            <RegistrarUsuario/>
        </MemoryRouter>
    )


//--------------Renderizado base-------------------------

describe('RegistrarUsuario  — renderizado base', () => {
    it('muestra el título de la vista', async () => {
        renderVista()
        await waitFor(() => {
            expect(screen.getByText('Crear Usuario')).toBeInTheDocument()
        })
    })

    //Renderisar inputs
    it('muestra los 4 inputs', async() => {
        renderVista()
        await waitFor(() => {
            const inputs = screen.getAllByPlaceholderText(/Escribe tu entrada/i)
            expect(inputs).toHaveLength(4)
          })
    })

    //Renderisa boton de renderizar
    it('muestra el boton de cancelar', async () => {
        renderVista()
        await waitFor(() => {
            expect(screen.getByText('Cancelar')).toBeInTheDocument()
        })
    })

    //No mostrar el modal
    it('no muestra el modal al inicio', async() => {
        renderVista()
        await waitFor(() => {
            expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
        })
    })
})
//--------------estados de error-------------------------

describe('RegistrarUsuario  — estados de error', () => {
    it('muestra mensaje de error si no hay token', async () => {
        localStorage.clear()

        renderVista()
        
        const errorMsg = await screen.findByText(/No eres un usuario, redirigiendo a login/i)
        expect(errorMsg).toBeInTheDocument()
        })


    //mensaje de autorizacion
    it('muestra mensaje de error si el backend responde que no esta autorizado', async () => {
        global.fetch.mockReset()
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ msg: "No Autorizado"})
        })

        renderVista()

        const errorMsg = await screen.findByText(/No eres un usuario autorizado, redirigiendo a login/i)
        expect(errorMsg).toBeInTheDocument()

    })

    //error de conexcion
    it('muestra mensaje cuando no hay conexion', async() => {
        global.fetch.mockReset()
        global.fetch.mockRejectedValueOnce(new Error("Network Error"))
 
        renderVista()

        const errorMsg = await screen.findByText(/Error de conexion, vuelva a iniciar secci/i)
        expect(errorMsg).toBeInTheDocument()    })
})
//--------------Validaciones del formulario-------------------------

describe('RegistrarUsuario  — validaciones del formulario', () => {
    
    //muiestra errir si no hay campos vacios
    it('muestra error si hay campos vacios al registrar', async () => {
        const user = userEvent.setup()
        renderVista()

        const botonRegistrar = screen.getByRole('button', { name: /registrar/i})
        await user.click(botonRegistrar)

        const errorMsg = await screen.findByText(/Llena todos los campos/i)
        expect(errorMsg).toBeInTheDocument()
    })

    //error si las contraseñas no coiciden
    it('muestra error si las contrasena no coinciden', async () => {
        const user = userEvent.setup()
        renderVista()
        
        const inputs= screen.getAllByPlaceholderText(/Escribe tu entrada/i)

        await user.type(inputs[0], 'juanperez')
        await user.type(inputs[1], 'Correo@test.com')
        await user.type(inputs[2], '123')
        await user.type(inputs[3], '124')

        const botonRegistrar = screen.getByRole('button', { name: /registrar/i})
        await user.click(botonRegistrar)

        const errorMsg = await screen.findByText(/Las contraseñas no coinciden, deben ser iguales/i)
        expect(errorMsg).toBeInTheDocument()
    })

    //el correo no es valido por no cumplir el formato
    it('muestra error si el correo no tiene un formato valido', async () => {
        const user = userEvent.setup()
        renderVista()
        
        const inputs= screen.getAllByPlaceholderText(/Escribe tu entrada/i)

        await user.type(inputs[0], 'juanperez')
        await user.type(inputs[1], 'Correofake')
        await user.type(inputs[2], '123')
        await user.type(inputs[3], '123')

        const botonRegistrar = screen.getByRole('button', { name: /registrar/i})
        await user.click(botonRegistrar)

        const errorMsg = await screen.findByText(/Incerte un correo valido/i)
        expect(errorMsg).toBeInTheDocument()
    })

    //error si hay caracteres especiales
    it('muestra error usuario contiene caracteres especiales', async () => {
        const user = userEvent.setup()
        renderVista()
        
        const inputs= screen.getAllByPlaceholderText(/Escribe tu entrada/i)

        await user.type(inputs[0], 'juan@perez')
        await user.type(inputs[1], 'Correo@test.com')
        await user.type(inputs[2], '123')
        await user.type(inputs[3], '123')

        const botonRegistrar = screen.getByRole('button', { name: /registrar/i})
        await user.click(botonRegistrar)

        const errorMsg = await screen.findByText(/El usuario debe de tener solo letras o numeros y sin espacios al inicio o final/i)        
        expect(errorMsg).toBeInTheDocument()
    })

    //error si la contraseña exede mas de 20 caracteres
    it('muestra error si la contrasena exede mas de 20 caracteres', async () => {
        const user = userEvent.setup()
        renderVista()
        
        const inputs= screen.getAllByPlaceholderText(/Escribe tu entrada/i)

        await user.type(inputs[0], 'juanperez')
        await user.type(inputs[1], 'Correo@test.com')
        await user.type(inputs[2], 'a'.repeat(21))
        await user.type(inputs[3], 'a'.repeat(21))

        const botonRegistrar = screen.getByRole('button', { name: /registrar/i})
        await user.click(botonRegistrar)

        const errorMsg = await screen.findByText(/La contraseña debe ser menor a 21 caracteres/i)
        expect(errorMsg).toBeInTheDocument()
    })

    it('muestra error si el correo tiene espacios', async () => {
        const user = userEvent.setup()
        renderVista()
        
        const inputs= screen.getAllByPlaceholderText(/Escribe tu entrada/i)

        await user.type(inputs[0], 'juanperez')
        await user.type(inputs[1], 'Correo@ test.com')
        await user.type(inputs[2], '123')
        await user.type(inputs[3], '123')

        const botonRegistrar = screen.getByRole('button', { name: /registrar/i})
        await user.click(botonRegistrar)

        const errorMsg = await screen.findByText(/Solo se pueden usar espacios en el usuario/i)
        expect(errorMsg).toBeInTheDocument()
    })
}) 

//--------------Flujo del modal-------------------------

describe('RegistrarUsuario — flujo modal', () => {

    //el modal al cancelar
    it('abre el modal al hacer click en cancelar', async () => {
        const user = userEvent.setup()
        renderVista()

        await user.click(screen.getByRole('button', { name: /cancelar/i }))
        expect(screen.getByTestId('modal-confirmacion')).toBeInTheDocument()
    })

    //cierra modal al cancelar
    it('cierra el modal al cancelar', async () => {
        const user = userEvent.setup()
        renderVista()

        await user.click(screen.getByRole('button', { name: /cancelar/i }))

        const botonesCancelar = screen.getAllByRole('button', { name: /cancelar/i})
        await user.click(botonesCancelar[1])

        expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
    })

    //Ruta correcta al navegar
    it('navega a la ruta correcta al confirmar', async () => {
        const user = userEvent.setup()
        renderVista()

        await user.click(screen.getByRole('button', { name: /cancelar/i }))
        await user.click(screen.getByRole('button', { name: /confirmar/i }))

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/usuario')
        })
    })

    //cierra el modal al confirmmar
    it('cierra el modal tras confirmar', async () => {
        const user = userEvent.setup()
        renderVista()

        await user.click(screen.getByRole('button', { name: /cancelar/i }))
        await user.click(screen.getByRole('button', { name: /confirmar/i }))

        await waitFor(() => {
            expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
        })
    })
})

//--------------Flujo del registro exitoso-------------------------

describe('RegistrarUsuario — flujo de registro exitoso', () => {

        //cierra el modal al confirmmar
    it('navega a /usuario tras registro exitoso', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ msg: 'Usuario creado', id: 42 })
        })

    const user = userEvent.setup()
        renderVista()
    const inputs = screen.getAllByPlaceholderText(/Escribe tu entrada/i)
        await user.type(inputs[0], 'juanperez')
        await user.type(inputs[1], 'correo@test.com')
        await user.type(inputs[2], 'password123')
        await user.type(inputs[3], 'password123')
        await user.click(screen.getByRole('button', { name: /registrar/i }))
    expect(screen.getByTestId('modal-confirmacion')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: /confirmar/i }))
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/usuario')
    })
    })
})

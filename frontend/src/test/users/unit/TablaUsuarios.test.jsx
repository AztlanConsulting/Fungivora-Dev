import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TablaUsuarios from '../../../features/user/components/TablaUsuarios'

// Mocks
vi.mock('../../../shared/components/ui/basics/texto', () => ({
    default: ({ children, variante, style }) => (
        <p data-testid="text" data-variante={variante} style={style}>
            {children}
        </p>
    ),
}))

vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: ({ size, color }) => (
        <span data-testid="icon" data-size={size} data-color={color} />
    ),
}))

vi.mock('@hugeicons/core-free-icons', () => ({
    CancelCircleIcon: {},
}))

vi.mock('../../../shared/components/ui/basics/colores', () => ({
    colores: {
        blanco: '#fff',
        azul: '#3b3fb6',
        gris: '#555555',
    },
}))

// Datos de prueba 

const usuariosMock = [
    { id_usuario: 1, nombre_usuario: 'Juan Perez', correo_usuario: 'juan@test.com' },
    { id_usuario: 2, nombre_usuario: 'Maria Lopez', correo_usuario: 'maria@test.com' },
    { id_usuario: 3, nombre_usuario: 'Carlos Ruiz', correo_usuario: 'carlos@test.com' },
]

const renderComponente = (props = {}) => {
    const defaults = {
        datos: usuariosMock,
        esAdmin: true,
        colorBordeHeader: '#e2e8f0',
        onEliminar: vi.fn(),
    }
    return render(<TablaUsuarios {...defaults} {...props} />)
}

beforeEach(() => {
    vi.clearAllMocks()
})

// Describe los casos de renderizado base 
describe('TablaUsuarios — renderizado base', () => {

    //Caso de renderizado completo
    it('caso de renderizado exitoso', () => {
        expect(() => renderComponente()).not.toThrow()
    })

    //Caso de encabezado con el nombre correcto para los nombres
    it('muestra el titulo "Nombre de Usuario"', () => {
        renderComponente()
        expect(screen.getAllByText('Nombre de Usuario').length).toBeGreaterThan(0)
    })
    //Caso de encabezado con el nombre correcto para los correos
    it('muestra el titulo "Correo Electrónico"', () => {
        renderComponente()
        expect(screen.getAllByText('Correo Electrónico').length).toBeGreaterThan(0)
    })

    //verifica si es administrador  y muestra la tabla
    it('muestra el encabezado "Acciones" cuando esAdmin=true', () => {
        renderComponente()
        expect(screen.getAllByText('Acciones').length).toBeGreaterThan(0)
    })

    //caso donde se verifica si no es administrador y no muestra la tabla
    it('no muestra el encabezado "Acciones" cuando esAdmin=false', () => {
        renderComponente({ esAdmin: false })
        expect(screen.queryByText('Acciones')).not.toBeInTheDocument()
    })

    //muestra mensaje de cuando no hay usuarios 
    it('muestra mensaje cuando no hay usuarios', () => {
        renderComponente({ datos: [] })
        expect(screen.getByText('No hay usuarios para mostrar.')).toBeInTheDocument()
    })
})

// Describe los casos reacionados con los datos de los usuarios 
describe('TablaUsuarios — datos de usuarios', () => {
    //Caso donde muestra el nombre de cada usuario
    it('muestra el nombre de cada usuario', () => {
        renderComponente()
        expect(screen.getAllByText('Juan Perez').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Maria Lopez').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Carlos Ruiz').length).toBeGreaterThan(0)
    })

    //Caso donde muestra el correo de cada usuario
    it('muestra el correo de cada usuario', () => {
        renderComponente()
        expect(screen.getAllByText('juan@test.com').length).toBeGreaterThan(0)
        expect(screen.getAllByText('maria@test.com').length).toBeGreaterThan(0)
        expect(screen.getAllByText('carlos@test.com').length).toBeGreaterThan(0)
    })
})

//Describe los casos para los botones de eliminar
describe('TablaUsuarios — botones de eliminar', () => {
    //Caso donde muestra el boton cuando el usuario es admin
    it('renderiza un botón de eliminar por usuario es administrador', () => {
        renderComponente()
        const botones = screen.getAllByTitle('Eliminar Usuario')
        expect(botones.length).toBe(usuariosMock.length)
    })

    //caso donde si no es administrador no muestra el boton de elimina 
    it('no renderiza botones de eliminar cuando no es administrador', () => {
        renderComponente({ esAdmin: false })
        expect(screen.queryByTitle('Eliminar Usuario')).not.toBeInTheDocument()
    })
})

//Casos donde se describen las interacciones 
describe('TablaUsuarios — interacciones', () => {
    //describe caso de eliminar usario
    it('Eliminar con la id al hacer click en eliminar', async () => {
        const user = userEvent.setup()
        const onEliminar = vi.fn()
        renderComponente({
            datos: [{ id_usuario: 7, nombre_usuario: 'Test', correo_usuario: 'test@test.com' }],
            onEliminar,
        })

        const boton = screen.getByTitle('Eliminar Usuario')
        await user.click(boton)

        expect(onEliminar).toHaveBeenCalledWith(7)
    })

    //caso de eliminar cuando haga click
    it('Eliminar una sola vez por click', async () => {
        const user = userEvent.setup()
        const onEliminar = vi.fn()
        renderComponente({
            datos: [{ id_usuario: 5, nombre_usuario: 'Solo', correo_usuario: 'solo@test.com' }],
            onEliminar,
        })

        const boton = screen.getByTitle('Eliminar Usuario')
        await user.click(boton)

        expect(onEliminar).toHaveBeenCalledTimes(1)
    })
})

//Describe casos de paginación 
describe('TablaUsuarios — paginación', () => {

    //10 usuarios para forzar paginacion
    const usuariosLargos = Array.from({ length: 10 }, (_, i) => ({
        id_usuario: i + 1,
        nombre_usuario: `Usuario ${i + 1}`,
        correo_usuario: `usuario${i + 1}@test.com`
    }))

    //caso donde solo hay 5 usuarios 
    it('Solo hay 5 Usuarios', () => {
        renderComponente({ datos: usuariosLargos })

        expect(screen.getAllByText('Usuario 1').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Usuario 5').length).toBeGreaterThan(0)
        expect(screen.queryByText('Usuario 6')).not.toBeInTheDocument()
    })

    //caso muestra los controles si exsten mas de 5 usuarios
    it('muestra los controles de paginacion cuando hay mas de 5 usuarios', () => {
        renderComponente({ datos: usuariosLargos })
        expect(screen.getByText('Anterior')).toBeInTheDocument()
        expect(screen.getByText('Siguiente')).toBeInTheDocument()
    })

    //Caso NO muestra los controles si exsten mas de 5 usuarios
    it('no muestra controles de paginacion cuando hay 5 o menos usuarios', () => {
        renderComponente()  //tiene 3 usuarios

        expect(screen.queryByText('Anterior')).not.toBeInTheDocument()
        expect(screen.queryByText('Siguiente')).not.toBeInTheDocument()
    })

    //Caso muestra numeracion si hay 10 usuarios
    it('muestra "1 de 2" al inicio cuando hay 10 usuarios', () => {
        renderComponente({ datos: usuariosLargos })

        expect(screen.getByText('1 de 2')).toBeInTheDocument()
    })

    //caso donde se hace la paginacion al hacer click al boton
    it('avanza a la pagina 2 al hacer click en Siguiente', async () => {
        const user = userEvent.setup()
        renderComponente({ datos: usuariosLargos })

        await user.click(screen.getByText('Siguiente'))

        expect(screen.getAllByText('Usuario 6').length).toBeGreaterThan(0)
        expect(screen.queryByText('Usuario 1')).not.toBeInTheDocument()
        expect(screen.getByText('2 de 2')).toBeInTheDocument()
    })

    //caso donde regresa la pagina 1 al hacer click al boton
    it('regresa a la pagina 1 al hacer click en Anterior', async () => {
        const user = userEvent.setup()
        renderComponente({ datos: usuariosLargos })

        await user.click(screen.getByText('Siguiente'))
        await user.click(screen.getByText('Anterior'))
        expect(screen.getAllByText('Usuario 1').length).toBeGreaterThan(0)
        expect(screen.getByText('1 de 2')).toBeInTheDocument()
    })

    //Caso donde se desabilita el boton de regresar en la primera pagina
    it('deshabilita el boton Anterior en la primera pagina', () => {
        renderComponente({ datos: usuariosLargos })
        expect(screen.getByText('Anterior').closest('button')).toBeDisabled()
    })

    //Caso donde se desabilita el boton de siguiente en la ultima pagina
    it('deshabilita el boton Siguiente en la ultima pagina', async () => {
        const user = userEvent.setup()
        renderComponente({ datos: usuariosLargos })
        await user.click(screen.getByText('Siguiente'))
        expect(screen.getByText('Siguiente').closest('button')).toBeDisabled()
    })

    //Caso que muestra boton de eliminar solo para los usuarios en la pagina
    it('muestra un boton de eliminar solo por los usuarios visibles', () => {
        renderComponente({ datos: usuariosLargos })

        const botones = screen.getAllByTitle('Eliminar Usuario')
        expect(botones.length).toBe(5)
    })
})
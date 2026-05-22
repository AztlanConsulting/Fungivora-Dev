import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BibliotecaView from '../../../features/inoculos/components/BibliotecaView'

// Mocks 

vi.mock('../../../features/inoculos/hooks/useEspeciesList')
import useEspeciesList from '../../../features/inoculos/hooks/useEspeciesList'

vi.mock('../../../features/inoculos/components/InoculoCard', () => ({
    default: ({ especie }) => <div data-testid={`card-${especie.value}`}>{especie.label}</div>,
}))

vi.mock('../../../features/inoculos/components/ModalCrearInoculo', () => ({
    default: ({ visible, onConfirm, onCancel }) =>
        visible ? (
            <div data-testid="modal-crear">
                <button onClick={() => onConfirm('Agar')}>Confirmar</button>
                <button onClick={onCancel}>Cancelar</button>
            </div>
        ) : null,
}))

vi.mock('../../../shared/components/ui/basics/titulo', () => ({
    default: ({ children }) => <h1>{children}</h1>,
}))
vi.mock('../../../shared/components/layout/Base', () => ({
    default: ({ children }) => <div>{children}</div>,
}))
vi.mock('../../../shared/components/ui/basics/texto', () => ({
    default: ({ children }) => <p>{children}</p>,
}))
vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <span />,
}))
vi.mock('@hugeicons/core-free-icons', async (importOriginal) => {
    const actual = await importOriginal()
    return { ...actual }
})

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return { ...actual, useNavigate: () => mockNavigate }
})

// Estado base del hook 

const hookBase = {
    especies: [],
    loading: false,
    error: null,
}

const especiesMock = [
    { value: 'PA', label: 'Pleurotus Abalonus' },
    { value: 'HE', label: 'Hericium Erinaceus' },
]

beforeEach(() => {
    vi.clearAllMocks()
    useEspeciesList.mockReturnValue(hookBase)
})

const renderVista = () =>
    render(
        <MemoryRouter>
            <BibliotecaView />
        </MemoryRouter>
    )

// Renderizado base 

describe('BibliotecaView — renderizado base', () => {
    it('muestra el título de la vista', () => {
        renderVista()
        expect(screen.getByText('Biblioteca Genética')).toBeInTheDocument()
    })

    it('muestra el botón FAB de crear', () => {
        renderVista()
        expect(screen.getByLabelText('Crear inóculo')).toBeInTheDocument()
    })
})

// Estados de carga y error 

describe('BibliotecaView — estados', () => {
    it('muestra mensaje de carga', () => {
        useEspeciesList.mockReturnValue({ ...hookBase, loading: true })
        renderVista()
        expect(screen.getByText('Cargando especies...')).toBeInTheDocument()
    })

    it('muestra mensaje de error', () => {
        useEspeciesList.mockReturnValue({ ...hookBase, error: 'Error de red' })
        renderVista()
        expect(screen.getByText('Error de red')).toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay especies', () => {
        renderVista()
        expect(screen.getByText('No hay especies registradas.')).toBeInTheDocument()
    })
})

// Renderizado de cards 

describe('BibliotecaView — cards', () => {
    it('renderiza una card por cada especie', () => {
        useEspeciesList.mockReturnValue({ ...hookBase, especies: especiesMock })
        renderVista()
        expect(screen.getByTestId('card-PA')).toBeInTheDocument()
        expect(screen.getByTestId('card-HE')).toBeInTheDocument()
    })

    it('muestra el nombre de cada especie en su card', () => {
        useEspeciesList.mockReturnValue({ ...hookBase, especies: especiesMock })
        renderVista()
        expect(screen.getByText('Pleurotus Abalonus')).toBeInTheDocument()
        expect(screen.getByText('Hericium Erinaceus')).toBeInTheDocument()
    })

    it('no renderiza cards mientras carga', () => {
        useEspeciesList.mockReturnValue({ ...hookBase, loading: true, especies: especiesMock })
        renderVista()
        expect(screen.queryByTestId('card-PA')).not.toBeInTheDocument()
    })
})

// Flujo del modal 

describe('BibliotecaView — flujo modal', () => {
    it('el modal no es visible al inicio', () => {
        renderVista()
        expect(screen.queryByTestId('modal-crear')).not.toBeInTheDocument()
    })

    it('abre el modal al hacer click en el FAB', async () => {
        const user = userEvent.setup()
        renderVista()

        await user.click(screen.getByLabelText('Crear inóculo'))

        expect(screen.getByTestId('modal-crear')).toBeInTheDocument()
    })

    it('cierra el modal al cancelar', async () => {
        const user = userEvent.setup()
        renderVista()

        await user.click(screen.getByLabelText('Crear inóculo'))
        await user.click(screen.getByText('Cancelar'))

        expect(screen.queryByTestId('modal-crear')).not.toBeInTheDocument()
    })

    it('navega a la ruta correcta al confirmar con agar', async () => {
        const user = userEvent.setup()
        renderVista()

        await user.click(screen.getByLabelText('Crear inóculo'))
        await user.click(screen.getByText('Confirmar'))

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/inoculos/crear/agar')
        })
    })

    it('cierra el modal tras confirmar', async () => {
        const user = userEvent.setup()
        renderVista()

        await user.click(screen.getByLabelText('Crear inóculo'))
        await user.click(screen.getByText('Confirmar'))

        await waitFor(() => {
            expect(screen.queryByTestId('modal-crear')).not.toBeInTheDocument()
        })
    })
})
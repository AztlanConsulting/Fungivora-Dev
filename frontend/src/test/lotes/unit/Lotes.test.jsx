import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Lotes } from '../../../pages'

// Mocks
vi.mock('../../../features/lotes/hooks/useLotes')
import useLotes from '../../../features/lotes/hooks/useLotes'

vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <div data-testid="icon-mock" />
}))

const renderWithRouter = (component) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    )
}

// datos dummy
const lotesMock = [
    {
        id_lote: 1,
        codigo_fungivora: 'LOTE-001',
        tipo_sustrato: 'Paja de Trigo',
        ubicacion_lote: 'Estante A1',
        fase: 'Inoculación',
        fecha_lote: '2024-03-20T10:00:00Z'
    }
]

const hookBase = {
    datos: [],
    sustratos: [{ value: 'Paja', label: 'Paja' }],
    ubicaciones: [{ value: 'Estante A', label: 'Estante A' }],
    especies: [{ value: 1, label: 'G1 / Gírgola' }],
    cargando: false,
    error: null,
    addLote: vi.fn(),
    refresh: vi.fn()
}

beforeEach(() => {
    vi.clearAllMocks()
    useLotes.mockReturnValue(hookBase)
})

describe('Página Lotes ', () => {
    it('muestra el título Lotes', () => {
        renderWithRouter(<Lotes />)
        const titulos = screen.getAllByText('Lotes')
        expect(titulos[0]).toBeInTheDocument()
    })

    it('muestra el formulario de creación', () => {
        renderWithRouter(<Lotes />)
        const formTitle = screen.getAllByText(/Crear Lote/i)
        expect(formTitle.length).toBeGreaterThan(0)
        expect(screen.getByText('Especie')).toBeInTheDocument()
    })
})

describe('Página Lotes — Listado', () => {
    it('estilo correcto según la fase', () => {
        useLotes.mockReturnValue({ ...hookBase, datos: lotesMock })
        renderWithRouter(<Lotes />)
        const badges = screen.getAllByText('Inoculación')
        expect(badges[0]).toHaveStyle({ color: 'rgb(198, 40, 40)' })
    })
})

describe('Página Lotes — Acciones y Formulario', () => {
    it('muestra error de validación', async () => {
        const user = userEvent.setup()
        renderWithRouter(<Lotes />)
        const botonEnviar = screen.getByRole('button', { name: /Siguiente/i })
        await user.click(botonEnviar)

        expect(
            await screen.findByText(/completa los datos del lote/i)
        ).toBeInTheDocument()
    })

    it('vista tabla y formulario en móvil', async () => {
        const user = userEvent.setup()

        renderWithRouter(<Lotes />)

        const botonToggle = screen.getByText('Crear lote')

        await user.click(botonToggle)

        expect(
            screen.getByText('Ver Lotes')
        ).toBeInTheDocument()
    })
})
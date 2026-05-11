import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Lotes } from '../../../pages' 

// Mocks
vi.mock('../../../features/lotes/hooks/useLotes')
import useLotes from '../../../features/lotes/hooks/useLotes'

vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <div data-testid="icon-mock" />
}))

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
        render(<Lotes />)
        const titulos = screen.getAllByText('Lotes')
        expect(titulos[0]).toBeInTheDocument()
    })

    it('muestra el formulario de creación', () => {
        render(<Lotes />)
        const formTitle = screen.getAllByText(/Crear Lote/i)
        expect(formTitle.length).toBeGreaterThan(0)
        expect(screen.getByText('Inóculo / (Especie)')).toBeInTheDocument()
    })
})

describe('Página Lotes — Listado', () => {
    it('estilo correcto según la fase', () => {
        useLotes.mockReturnValue({ ...hookBase, datos: lotesMock })
        render(<Lotes />)
        const badges = screen.getAllByText('Inoculación')
        expect(badges[0]).toHaveStyle({ color: 'rgb(198, 40, 40)' }) 
    })
})

describe('Página Lotes — Acciones y Formulario', () => {
    it('muestra error de validación', async () => {
        const user = userEvent.setup()
        render(<Lotes />)
        const botonEnviar = screen.getByRole('button', { name: /Crear Lote/i })
        await user.click(botonEnviar)

        expect(screen.getByText('Por favor, completa los campos')).toBeInTheDocument()
    })

    it('vista tabla y formulario en móvil', async () => {
        const user = userEvent.setup()
        render(<Lotes />)
        const botonToggle = screen.getByText((content, element) => {
            return content === 'Crear lote' && 
                   window.getComputedStyle(element).fontSize === '14px';
        });

        await user.click(botonToggle)

        const labelToggleCambiado = screen.getByText((content, element) => {
            return content === 'Lotes' && 
                   window.getComputedStyle(element).fontSize === '14px';
        });
        
        expect(labelToggleCambiado).toBeInTheDocument()
    })
})
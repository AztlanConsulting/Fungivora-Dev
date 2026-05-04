import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Inventario from '../../../pages/inventario/inventario'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../../features/inventario/hooks/useInsumos')
import useInsumos from '../../../features/inventario/hooks/useInsumos'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

// ─── Datos de prueba ──────────────────────────────────────────────────────────

const insumosMock = [
    { id_insumo: 1, nombre: 'Agua destilada', cantidad: 2000, unidad: 'ml', stock_recomendado: 200 },
    { id_insumo: 2, nombre: 'Peptona',         cantidad: 200,  unidad: 'g',  stock_recomendado: 200 },
    { id_insumo: 3, nombre: 'Mijo rojo',       cantidad: 200,  unidad: 'g',  stock_recomendado: 200 },
]

const hookBase = {
    insumos: [],
    loading: false,
    error: null,
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const renderInventario = () =>
    render(
        <MemoryRouter>
            <Inventario />
        </MemoryRouter>
    )

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    vi.clearAllMocks()
    useInsumos.mockReturnValue(hookBase)
})

describe('Inventario — renderizado base', () => {

    it('muestra el título Inventario', () => {
        renderInventario()
        expect(screen.getByText('Inventario')).toBeInTheDocument()
    })

    it('muestra la barra de búsqueda', () => {
        renderInventario()
        // BarraBusqueda usa un <p> como placeholder visual, el input real no tiene placeholder
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('muestra los encabezados de la tabla', () => {
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()

       expect(screen.getAllByText('Insumo')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Cantidad Actual')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Stock Recomendado')[0]).toBeInTheDocument()
    })
})

describe('Inventario — estado de carga', () => {

    it('muestra "Cargando insumos..." mientras el hook carga', () => {
        useInsumos.mockReturnValue({ ...hookBase, loading: true })
        renderInventario()

        expect(screen.getByText('Cargando insumos...')).toBeInTheDocument()
    })

    it('no muestra la tabla mientras carga', () => {
        useInsumos.mockReturnValue({ ...hookBase, loading: true })
        renderInventario()

        expect(screen.queryByText('Insumo')).not.toBeInTheDocument()
    })
})

describe('Inventario — estado de error', () => {

    it('muestra el mensaje de error cuando el hook falla', () => {
        useInsumos.mockReturnValue({ ...hookBase, error: 'Error de conexión' })
        renderInventario()

        expect(screen.getByText('Error de conexión')).toBeInTheDocument()
    })
})

describe('Inventario — datos cargados', () => {

    it('renderiza todos los insumos recibidos', () => {
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()

        // Cada insumo aparece dos veces (móvil + desktop), se usa getAllByText
        expect(screen.getAllByText('Agua destilada').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Peptona').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Mijo rojo').length).toBeGreaterThan(0)
    })

    it('muestra "No se encontraron insumos" cuando la lista está vacía', () => {
        useInsumos.mockReturnValue({ ...hookBase, insumos: [] })
        renderInventario()

        expect(screen.getByText('No se encontraron insumos.')).toBeInTheDocument()
    })
})

describe('Inventario — búsqueda', () => {

    it('filtra insumos en tiempo real al escribir en el textbox', async () => {
        const user = userEvent.setup()
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()

        // El input real se busca por role textbox
        await user.type(screen.getByRole('textbox'), 'Agua')

        await waitFor(() => {
            expect(screen.getAllByText('Agua destilada').length).toBeGreaterThan(0)
            expect(screen.queryByText('Peptona')).not.toBeInTheDocument()
            expect(screen.queryByText('Mijo rojo')).not.toBeInTheDocument()
        })
    })

    it('muestra "No se encontraron insumos" si la búsqueda no tiene resultados', async () => {
        const user = userEvent.setup()
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()

        await user.type(screen.getByRole('textbox'), 'xyz')

        await waitFor(() => {
            expect(screen.getByText('No se encontraron insumos.')).toBeInTheDocument()
        })
    })
})

describe('Inventario — navegación', () => {

    it('navega a /inventario/crearInsumo al hacer clic en el botón +', async () => {
        const user = userEvent.setup()
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        const { container } = renderInventario()

        // El botón + es un div con clase rounded-full, se busca por querySelector
        const botonAgregar = container.querySelector('.rounded-full.cursor-pointer')
        await user.click(botonAgregar)

        expect(mockNavigate).toHaveBeenCalledWith('/inventario/crearInsumo')
    })
})
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Inventario } from '../../../pages'

vi.mock('../../../features/inventario/hooks/useInsumos')
import useInsumos from '../../../features/inventario/hooks/useInsumos'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

const hookBase = { insumos: [], loading: false, error: null }

const insumosMock = [
    { id_insumo: 1, nombre: 'Agua destilada', cantidad: 2000, unidad: 'ml', stock_recomendado: 200 },
    { id_insumo: 2, nombre: 'Peptona',         cantidad: 200,  unidad: 'g',  stock_recomendado: 200 },
    { id_insumo: 3, nombre: 'Mijo rojo',       cantidad: 200,  unidad: 'g',  stock_recomendado: 200 },
]

const renderInventario = () =>
    render(<MemoryRouter><Inventario /></MemoryRouter>)

beforeEach(() => {
    vi.clearAllMocks()
    useInsumos.mockReturnValue(hookBase)
})

describe('Inventario — integración página completa', () => {

    it('renderiza la página sin errores', () => {
        renderInventario()
        expect(screen.getByText('Inventario')).toBeInTheDocument()
    })

    it('flujo completo: loading → datos cargados → tabla visible', () => {
        useInsumos.mockReturnValue({ ...hookBase, loading: true })
        const { rerender } = renderInventario()

        expect(screen.getByText('Cargando insumos...')).toBeInTheDocument()
        expect(screen.queryByText('Insumo')).not.toBeInTheDocument()

        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        rerender(<MemoryRouter><Inventario /></MemoryRouter>)

        expect(screen.queryByText('Cargando insumos...')).not.toBeInTheDocument()
        expect(screen.getAllByText('Agua destilada').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Peptona').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Mijo rojo').length).toBeGreaterThan(0)
    })

    it('flujo de error: loading → error → muestra mensaje', () => {
        useInsumos.mockReturnValue({ ...hookBase, loading: true })
        const { rerender } = renderInventario()

        expect(screen.getByText('Cargando insumos...')).toBeInTheDocument()

        useInsumos.mockReturnValue({ ...hookBase, error: 'Error de conexión' })
        rerender(<MemoryRouter><Inventario /></MemoryRouter>)

        expect(screen.queryByText('Cargando insumos...')).not.toBeInTheDocument()
        expect(screen.getByText('Error de conexión')).toBeInTheDocument()
    })

    it('flujo búsqueda: datos visibles → escribe → filtra → borra → vuelven todos', async () => {
        const user = userEvent.setup()
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()

        expect(screen.getAllByText('Agua destilada').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Peptona').length).toBeGreaterThan(0)

        await user.type(screen.getByRole('textbox'), 'Agua')

        await waitFor(() => {
            expect(screen.getAllByText('Agua destilada').length).toBeGreaterThan(0)
            expect(screen.queryByText('Peptona')).not.toBeInTheDocument()
            expect(screen.queryByText('Mijo rojo')).not.toBeInTheDocument()
        })

        await user.clear(screen.getByRole('textbox'))

        await waitFor(() => {
            expect(screen.getAllByText('Agua destilada').length).toBeGreaterThan(0)
            expect(screen.getAllByText('Peptona').length).toBeGreaterThan(0)
            expect(screen.getAllByText('Mijo rojo').length).toBeGreaterThan(0)
        })
    })

    it('flujo sin resultados: búsqueda sin coincidencias → mensaje vacío', async () => {
        const user = userEvent.setup()
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()

        await user.type(screen.getByRole('textbox'), 'xyz')

        await waitFor(() => {
            expect(screen.getByText('No se encontraron insumos.')).toBeInTheDocument()
        })
    })

    it('flujo navegación: click en Agregar → navega a crearInsumo', async () => {
        const user = userEvent.setup()
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()

        // El botón ahora es <Button> con texto "Agregar"
        await user.click(screen.getByText('Agregar'))

        expect(mockNavigate).toHaveBeenCalledWith('/inventario/crearInsumo')
    })
})
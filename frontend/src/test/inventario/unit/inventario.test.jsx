import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Inventario from '../../../pages/inventario/Inventario'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../../features/inventario/hooks/useInsumos')
import useInsumos from '../../../features/inventario/hooks/useInsumos'

// ─── Datos de prueba ──────────────────────────────────────────────────────────

const insumosMock = [
    { id_insumo: 1, nombre: 'Agua destilada', cantidad: 2000, unidad: 'ml', stock_recomendado: 200 },
    { id_insumo: 2, nombre: 'Peptona', cantidad: 200, unidad: 'g', stock_recomendado: 200 },
    { id_insumo: 3, nombre: 'Mijo rojo', cantidad: 200, unidad: 'g', stock_recomendado: 200 },
]

const hookBase = {
    insumos: [],
    unidades: [],
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

    it('muestra los encabezados de la tabla', () => {
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()

        expect(screen.getAllByText('Insumo')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Cantidad Actual')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Stock Recomendado')[0]).toBeInTheDocument()
    })
})

describe('Inventario — estado de carga', () => {

    it('muestra "Cargando..." mientras el hook carga', () => {
        useInsumos.mockReturnValue({ ...hookBase, loading: true })
        renderInventario()

        expect(screen.getByText('Cargando...')).toBeInTheDocument()
    })

    it('no muestra la tabla mientras carga', () => {
        useInsumos.mockReturnValue({ ...hookBase, loading: true })
        renderInventario()

        expect(screen.queryByText('Insumo')).not.toBeInTheDocument()
    })
})

describe('Inventario — datos cargados', () => {

    it('renderiza todos los insumos recibidos', () => {
        useInsumos.mockReturnValue({ ...hookBase, insumos: insumosMock })
        renderInventario()
        expect(screen.getAllByText('Agua destilada').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Peptona').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Mijo rojo').length).toBeGreaterThan(0)
    })

})

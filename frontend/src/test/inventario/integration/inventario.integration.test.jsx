import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Inventario } from '../../../pages'

vi.mock('../../../features/inventario/hooks/useInsumos')
import useInsumos from '../../../features/inventario/hooks/useInsumos'

vi.mock('../../../features/inventario/components/FormularioInsumo', () => ({
    default: () => <div data-testid="formulario-insumo" />
}))

const unidadesMock = [
  { id: 1, opcion: 'ml' },
  { id: 2, opcion: 'g' },
]

const mockAddInsumo = vi.fn()
const mockUpdateInsumo = vi.fn()

const hookBase = { 
  insumos: [], 
  unidades: unidadesMock, 
  loading: false, 
  error: null,
  addInsumo: mockAddInsumo,
  updateInsumo: mockUpdateInsumo
}

const renderInventario = () =>
  render(<MemoryRouter><Inventario /></MemoryRouter>)

beforeEach(() => {
  vi.clearAllMocks()
  useInsumos.mockReturnValue(hookBase)
})

describe('Inventario — Integración con Formulario y Ajustes', () => {

  it('renderiza la página y el formulario de creación', () => {
    renderInventario()
    expect(screen.getByText('Inventario')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear insumo/i })).toBeInTheDocument()
  })

  it('flujo de carga: muestra skeleton/mensaje de carga', () => {
        useInsumos.mockReturnValue({ ...hookBase, loading: true })
        renderInventario()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
    })


  it('lógica de estados: muestra etiqueta correcta según cantidad', () => {
    const insumosEstado = [
      { id_insumo: 1, nombre: 'Agotado Item', cantidad: 0, unidad: 'ml', stock_recomendado: 100 },
      { id_insumo: 2, nombre: 'Bajo Item',    cantidad: 10, unidad: 'ml', stock_recomendado: 100 },
      { id_insumo: 3, nombre: 'Optimo Item',  cantidad: 200, unidad: 'ml', stock_recomendado: 100 },
    ]
    useInsumos.mockReturnValue({ ...hookBase, insumos: insumosEstado })
    
    renderInventario()
    
    expect(screen.getAllByText(/agotado/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/bajo/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/óptimo/i)[0]).toBeInTheDocument()
  })
})
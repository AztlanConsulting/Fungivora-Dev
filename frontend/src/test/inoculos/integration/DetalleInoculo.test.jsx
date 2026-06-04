import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DetalleInoculo from '../../../pages/inoculos/DetalleInoculo'
import useDetalleInoculo from '../../../features/inoculos/hooks/useDetalleInoculo'

vi.mock('../../../features/inoculos/hooks/useDetalleInoculo')
vi.mock('../../../features/inoculos/components/BannerInoculoInfo', () => ({
  default: ({ data }) => <div data-testid="banner-info">{data.codigo_fungivora}</div>
}))
vi.mock('../../../features/inoculos/components/BannerIngredientes', () => ({
  default: ({ ingredientes }) => <div data-testid="banner-ingredientes">{ingredientes.length} items</div>
}))
vi.mock('../../../shared/components/ui', () => ({
  Titulo: ({ children }) => <h1>{children}</h1>,
  Text: ({ children }) => <span>{children}</span>,
}))
vi.mock('../../../shared/components/layout', () => ({ 
  Base: ({ children }) => <div>{children}</div> 
}))

const mockInoculo = {
  id_inoculo: 1,
  codigo_fungivora: 'INO-001',
  especie: 'Shiitake',
  cantidad_disponible: 10
}

const mockIngredientes = [{ id_insumo: 1, nombre: 'Agar', cantidad: 5, unidad: 'g' }]

describe('DetalleInoculo — Pruebas de Integración', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el estado de carga inicialmente', () => {
    useDetalleInoculo.mockReturnValue({
      inoculo: null,
      ingredientes: [],
      cargando: true,
      error: null
    })
    
    render(<MemoryRouter initialEntries={['/inoculos/detalle/1']}><DetalleInoculo /></MemoryRouter>)
    expect(screen.getByText(/Cargando datos de inóculo/i)).toBeInTheDocument()
  })

  it('muestra un mensaje de error si el hook devuelve error', () => {
    useDetalleInoculo.mockReturnValue({
      inoculo: null,
      ingredientes: [],
      cargando: false,
      error: 'Error de servidor'
    })
    
    render(<MemoryRouter initialEntries={['/inoculos/detalle/1']}><DetalleInoculo /></MemoryRouter>)
    expect(screen.getByText(/Error de conexión/i)).toBeInTheDocument()
  })

  it('renderiza la información del inóculo y los banners correctamente cuando los datos cargan', () => {
    useDetalleInoculo.mockReturnValue({
      inoculo: mockInoculo,
      ingredientes: mockIngredientes,
      cargando: false,
      error: null
    })
    
    render(
      <MemoryRouter initialEntries={['/inoculos/detalle/1']}>
        <Routes>
          <Route path="/inoculos/detalle/:id_inoculo" element={<DetalleInoculo />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(/Inóculo: INO-001/i)).toBeInTheDocument()
    
    expect(screen.getByTestId('banner-info')).toBeInTheDocument()
    expect(screen.getByTestId('banner-ingredientes')).toHaveTextContent('1 items')
  })

  it('muestra mensaje si el inóculo no existe', () => {
    useDetalleInoculo.mockReturnValue({
      inoculo: null,
      ingredientes: [],
      cargando: false,
      error: null
    })
    
    render(<MemoryRouter initialEntries={['/inoculos/detalle/1']}><DetalleInoculo /></MemoryRouter>)
    expect(screen.getByText(/No se encontró el inóculo/i)).toBeInTheDocument()
  })
})
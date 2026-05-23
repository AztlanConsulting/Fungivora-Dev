import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DetalleLote from '../../../features/lotes/components/DetalleLote'
import useDetalleLote from '../../../features/lotes/hooks/useDetalleLote'

// Mocks
vi.mock('../../../features/lotes/hooks/useDetalleLote')

vi.mock('../../../features/lotes/components/BannerLote', () => ({
  default: ({ data }) => <div data-testid="banner">{data.especie}</div>
}))

vi.mock('../../../features/lotes/components/TablaBloques', () => ({
  default: ({ bloques, codigo_lote, onToggleContaminado }) => (
    <div data-testid="tabla-bloques" data-codigo={codigo_lote || ""}>
      {bloques.map(b => (
        <div key={b.id_bloque}>
          {b.contenedor}
          <button onClick={() => onToggleContaminado(b.id_bloque)}>Toggle</button>
        </div>
      ))}
    </div>
  )
}))

vi.mock('../../../features/lotes/components/SeccionFaseBuscar', () => ({
  default: ({ setFase }) => (
    <div>
      <button data-testid="btn-cambiar-fase" onClick={() => setFase(2)}>Cambiar Fase</button>
    </div>
  )
}))

vi.mock('../../../shared/components/ui', () => ({
  Titulo: ({ children }) => <h1>{children}</h1>,
  Text: ({ children }) => <span>{children}</span>,
  ModalConfirmacion: ({ visible, onConfirm, textoConfirmar }) => 
    visible ? <div data-testid="modal-conf"><button onClick={onConfirm}>{textoConfirmar}</button></div> : null,
  ModalAlerta: ({ visible, mensaje, variante }) => 
    visible ? <div data-testid="modal-alerta" data-variante={variante}>{mensaje}</div> : null,
}))

vi.mock('../../../shared/components/layout', () => ({ Base: ({ children }) => <div>{children}</div> }))

const bloquesMock = [{ id_bloque: 1, contenedor: 'Bolsa', contaminado: 0 }]
const hookBase = {
  bloques: bloquesMock,
  setBloques: vi.fn(),
  bloquesIniciales: [...bloquesMock],
  setBloquesIniciales: vi.fn(),
  fase: 1,
  setFase: vi.fn(),
  faseInicialNum: 1,
  setFaseInicialNum: vi.fn(),
  especie: 'Pleurotus',
  codigoInoculo: 'INO-1',
  cargando: false,
  error: null,
  getFase: (i) => `Fase ${i}`,
  fases: [{ label: 'Fase 1' }, { label: 'Fase 2' }],
  guardarCambios: vi.fn()
}

const renderWithRouter = (state = { codigo_fungivora: 'LT-01' }) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/lotes/1', state }]}>
      <Routes>
        <Route path="/lotes/:id_lote" element={<DetalleLote />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('DetalleLote — Pruebas de Integración', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useDetalleLote.mockReturnValue(hookBase)
  })

  const getBtnActualizar = () => screen.getByRole('button', { name: /Actualizar/i })

  describe('Flujo de edición', () => {
    it('muestra el botón Actualizar al detectar cambios de fase', async () => {
      const user = userEvent.setup()
      renderWithRouter()
      
      expect(screen.queryByRole('button', { name: /Actualizar/i })).not.toBeInTheDocument()

      await user.click(screen.getByTestId('btn-cambiar-fase'))
      
      expect(getBtnActualizar()).toBeInTheDocument()
    })

    it('ejecuta el guardado exitosamente', async () => {
      const user = userEvent.setup()
      const guardarCambios = vi.fn().mockResolvedValue({ success: true })
      useDetalleLote.mockReturnValue({ ...hookBase, guardarCambios })
      
      renderWithRouter()
      await user.click(screen.getByTestId('btn-cambiar-fase'))
      
      await user.click(getBtnActualizar())
      
      const btnConfirmar = screen.getByRole('button', { name: /Confirmar/i })
      await user.click(btnConfirmar)
      
      await waitFor(() => {
        expect(screen.getByText(/Cambios guardados exitosamente/i)).toBeInTheDocument()
      })
      expect(guardarCambios).toHaveBeenCalled()
    })

    it('muestra error si la API falla al guardar', async () => {
      const user = userEvent.setup()
      const guardarCambios = vi.fn().mockResolvedValue({ success: false, error: 'Falla técnica' })
      useDetalleLote.mockReturnValue({ ...hookBase, guardarCambios })
      
      renderWithRouter()

      await user.click(screen.getByTestId('btn-cambiar-fase'))
      await user.click(getBtnActualizar())
      await user.click(screen.getByRole('button', { name: /Confirmar/i }))

      await waitFor(() => {
        const alerta = screen.getByTestId('modal-alerta')
        expect(alerta).toHaveTextContent(/Falla técnica/i)
      })
    })
  })
})
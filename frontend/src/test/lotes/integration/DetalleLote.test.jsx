import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DetalleLote from '../../../features/lotes/components/DetalleLote'

// Mocks 

vi.mock('../../../features/lotes/hooks/useDetalleLote')
import useDetalleLote from '../../../features/lotes/hooks/useDetalleLote'

vi.mock('../../../features/lotes/components/BannerLote', () => ({
    default: ({ data }) => (
        <div data-testid="banner-lote">
            <span>{data.especie}</span>
            <span>{data.inoculo}</span>
            <span>{data.fecha}</span>
        </div>
    ),
}))

vi.mock('../../../features/lotes/components/TablaBloques', () => ({
    default: ({ bloques, loading, onToggleContaminado, codigo_lote }) => (
        <div data-testid="tabla-bloques" data-loading={loading} data-codigo={codigo_lote}>
            {bloques.map((b) => (
                <button
                    key={b.id_bloque}
                    data-testid={`toggle-${b.id_bloque}`}
                    onClick={() => onToggleContaminado(b.id_bloque)}
                >
                    bloque-{b.id_bloque}
                </button>
            ))}
        </div>
    ),
}))

vi.mock('../../../features/lotes/components/SeccionFaseBuscar', () => ({
    default: ({ fases, fase, setFase, busqueda, setBusqueda }) => (
        <div data-testid="seccion-fase">
            <button data-testid="cambiar-fase" onClick={() => setFase(2)}>
                Cambiar Fase
            </button>
            <input
                data-testid="input-busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda?.(e.target.value)}
            />
        </div>
    ),
}))

vi.mock('../../../shared/components/ui', () => ({
    Titulo: ({ children }) => <h1>{children}</h1>,
    Text: ({ children, variante, style }) => <p style={style}>{children}</p>,
    ModalConfirmacion: ({ visible, titulo, descripcion, onConfirm, onCancel, textoConfirmar, textoCancelar }) =>
        visible ? (
            <div data-testid="modal-confirmacion">
                <p>{titulo}</p>
                <p>{descripcion}</p>
                <button data-testid="btn-confirmar" onClick={onConfirm}>{textoConfirmar}</button>
                <button data-testid="btn-cancelar" onClick={onCancel}>{textoCancelar}</button>
            </div>
        ) : null,
    ModalAlerta: ({ visible, variante, mensaje, onClose }) =>
        visible ? (
            <div data-testid="modal-alerta" data-variante={variante}>
                <span>{mensaje}</span>
                <button data-testid="btn-cerrar-alerta" onClick={onClose}>Cerrar</button>
            </div>
        ) : null,
}))

vi.mock('../../../shared/components/layout', () => ({
    Base: ({ children }) => <div>{children}</div>,
}))

vi.mock('../../../shared/components/ui/basics/colores', () => ({
    colores: { azul: '#3b3fb6', gris: '#555555' },
}))

vi.mock('@hugeicons/core-free-icons', () => ({
    CheckmarkCircle02Icon: {},
}))

// Datos de prueba 

const bloquesMock = [
    { id_bloque: 1, contenedor: 'Bolsa', peso_gr: '800', produccion: 1, contaminado: 0 },
    { id_bloque: 2, contenedor: 'Frasco', peso_gr: '600', produccion: 0, contaminado: 0 },
]

const hookBase = {
    bloques: bloquesMock,
    setBloques: vi.fn(),
    fase: 1,
    setFase: vi.fn(),
    especie: 'Pleurotus Ostreatus',
    codigoInoculo: 'INO-001',
    cargando: false,
    error: null,
    getFase: vi.fn((i) => ['Inoculación', 'Colonización', 'Fructificación'][i] ?? 'Desconocida'),
    guardarCambios: vi.fn(),
    fases: [
        { label: 'Inoculación' },
        { label: 'Colonización' },
        { label: 'Fructificación' },
    ],
    setBloquesIniciales: vi.fn(),
    setFaseInicialNum: vi.fn(),
    setEditado: vi.fn(),
}

const routerState = {
    codigo_fungivora: 'LT-001',
    fecha: '2026-04-27T06:00:00.000Z',
    sustrato: 'Paja de trigo',
    ubicacion: 'Invernadero A',
    id_inoculo_usado: 5,
    fase: 'Colonización',
}

const renderPagina = (state = routerState, id_lote = '10') =>
    render(
        <MemoryRouter initialEntries={[{ pathname: `/lotes/${id_lote}`, state }]}>
            <Routes>
                <Route path="/lotes/:id_lote" element={<DetalleLote />} />
            </Routes>
        </MemoryRouter>
    )

beforeEach(() => {
    vi.clearAllMocks()
    hookBase.setBloques = vi.fn()
    hookBase.setFase = vi.fn()
    hookBase.guardarCambios = vi.fn()
    hookBase.getFase = vi.fn((i) => ['Inoculación', 'Colonización', 'Fructificación'][i] ?? 'Desconocida')
    useDetalleLote.mockReturnValue({ ...hookBase })
})

// Renderizado base 

describe('DetalleLote — renderizado base', () => {
    it('renderiza sin errores', () => {
        expect(() => renderPagina()).not.toThrow()
    })

    it('muestra el título con el código del lote', () => {
        renderPagina()
        expect(screen.getByText('Lote: LT-001')).toBeInTheDocument()
    })

    it('muestra "Detalle" en el título cuando no hay código en state', () => {
        renderPagina({ ...routerState, codigo_fungivora: undefined })
        expect(screen.getByText('Lote: Detalle')).toBeInTheDocument()
    })

    it('renderiza el BannerLote', () => {
        renderPagina()
        expect(screen.getByTestId('banner-lote')).toBeInTheDocument()
    })

    it('renderiza el SeccionFaseBuscar', () => {
        renderPagina()
        expect(screen.getByTestId('seccion-fase')).toBeInTheDocument()
    })

    it('renderiza la TablaBloques', () => {
        renderPagina()
        expect(screen.getByTestId('tabla-bloques')).toBeInTheDocument()
    })

    it('no muestra el botón de guardar al inicio', () => {
        renderPagina()
        expect(screen.queryByRole('button', { name: /Guardar/ })).not.toBeInTheDocument()
    })

    it('no muestra el modal de confirmación al inicio', () => {
        renderPagina()
        expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
    })

    it('no muestra la alerta al inicio', () => {
        renderPagina()
        expect(screen.queryByTestId('modal-alerta')).not.toBeInTheDocument()
    })
})

// BannerLote — loteData 

describe('DetalleLote — loteData hacia BannerLote', () => {
    it('muestra la especie del hook', () => {
        renderPagina()
        expect(screen.getByText('Pleurotus Ostreatus')).toBeInTheDocument()
    })

    it('muestra el código de inóculo del hook', () => {
        renderPagina()
        expect(screen.getByText('INO-001')).toBeInTheDocument()
    })

    it('muestra "Cargando..." como especie cuando cargando=true', () => {
        useDetalleLote.mockReturnValue({ ...hookBase, cargando: true })
        renderPagina()
        expect(screen.getAllByText('Cargando...').length).toBeGreaterThan(0)
    })

    it('muestra "S/N" como especie cuando especie está vacío y no carga', () => {
        useDetalleLote.mockReturnValue({ ...hookBase, especie: '' })
        renderPagina()
        expect(screen.getAllByText('S/N').length).toBeGreaterThan(0)
    })

    it('pasa loading=true a TablaBloques cuando cargando=true', () => {
        useDetalleLote.mockReturnValue({ ...hookBase, cargando: true })
        renderPagina()
        expect(screen.getByTestId('tabla-bloques')).toHaveAttribute('data-loading', 'true')
    })

    it('pasa el codigo_lote del state a TablaBloques', () => {
        renderPagina()
        expect(screen.getByTestId('tabla-bloques')).toHaveAttribute('data-codigo', 'LT-001')
    })

    it('pasa "" como codigo_lote cuando state no tiene código', () => {
        renderPagina({ ...routerState, codigo_fungivora: undefined })
        expect(screen.getByTestId('tabla-bloques')).toHaveAttribute('data-codigo', '')
    })
})

// Error del hook 

describe('DetalleLote — error del hook', () => {
    it('muestra el mensaje de error cuando el hook retorna error', () => {
        useDetalleLote.mockReturnValue({ ...hookBase, error: 'Error de red' })
        renderPagina()
        expect(screen.getByText('Error: Error de red')).toBeInTheDocument()
    })

    it('no muestra el bloque de error cuando no hay error', () => {
        renderPagina()
        expect(screen.queryByText(/^Error:/)).not.toBeInTheDocument()
    })
})

// Filtrado de bloques 

describe.skip('DetalleLote — filtrado de bloques', () => {
    it('muestra todos los bloques sin filtro', () => {
        renderPagina()
        expect(screen.getByTestId('toggle-1')).toBeInTheDocument()
        expect(screen.getByTestId('toggle-2')).toBeInTheDocument()
    })

    it('filtra bloques por id_bloque al escribir en la búsqueda', async () => {
        const user = userEvent.setup()
        renderPagina()

        await user.type(screen.getByTestId('input-busqueda'), '1')

        expect(screen.getByTestId('toggle-1')).toBeInTheDocument()
        expect(screen.queryByTestId('toggle-2')).not.toBeInTheDocument()
    })

    it('filtra bloques por contenedor (case insensitive)', async () => {
        const user = userEvent.setup()
        renderPagina()

        await user.type(screen.getByTestId('input-busqueda'), 'frasco')

        expect(screen.queryByTestId('toggle-1')).not.toBeInTheDocument()
        expect(screen.getByTestId('toggle-2')).toBeInTheDocument()
    })
})

// handleLocalToggleContaminado 

describe('DetalleLote — toggle contaminado', () => {
    it('llama a setBloques al hacer toggle en un bloque', async () => {
        const user = userEvent.setup()
        const setBloques = vi.fn()
        useDetalleLote.mockReturnValue({ ...hookBase, setBloques })
        renderPagina()

        await user.click(screen.getByTestId('toggle-1'))

        expect(setBloques).toHaveBeenCalledTimes(1)
    })

    it('invierte contaminado de 0 a 1 al hacer toggle', async () => {
        const user = userEvent.setup()
        const setBloques = vi.fn()
        useDetalleLote.mockReturnValue({ ...hookBase, setBloques })
        renderPagina()

        await user.click(screen.getByTestId('toggle-1'))

        const bloquesActualizados = setBloques.mock.calls[0][0]
        const bloqueModificado = bloquesActualizados.find((b) => b.id_bloque === 1)
        expect(bloqueModificado.contaminado).toBe(1)
    })

    it('muestra el botón guardar tras hacer toggle', async () => {
        const user = userEvent.setup()
        renderPagina()

        await user.click(screen.getByTestId('toggle-1'))

        expect(screen.getByRole('button', { name: /Guardar/ })).toBeInTheDocument()
    })
})

// handleLocalChangeFase 

describe('DetalleLote — cambio de fase', () => {
    it('llama a setFase al cambiar de fase', async () => {
        const user = userEvent.setup()
        const setFase = vi.fn()
        useDetalleLote.mockReturnValue({ ...hookBase, setFase })
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))

        expect(setFase).toHaveBeenCalledWith(2)
    })

    it('muestra el botón guardar tras cambiar la fase', async () => {
        const user = userEvent.setup()
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))

        expect(screen.getByRole('button', { name: /Guardar/ })).toBeInTheDocument()
    })
})

// Flujo guardar cambios 

describe('DetalleLote — flujo guardar cambios', () => {
    it('abre el modal de confirmación al hacer click en guardar', async () => {
        const user = userEvent.setup()
        renderPagina()

        // Primero producimos un cambio para que aparezca el botón
        await user.click(screen.getByTestId('cambiar-fase'))
        await user.click(screen.getByRole('button', { name: /Guardar/ }))

        expect(screen.getByTestId('modal-confirmacion')).toBeInTheDocument()
    })

    it('muestra la fase actual en la descripción del modal', async () => {
        const user = userEvent.setup()
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))
        await user.click(screen.getByRole('button', { name: /Guardar/ }))

        expect(screen.getByText(/Nueva Fase:/)).toBeInTheDocument()
    })

    it('cierra el modal al cancelar', async () => {
        const user = userEvent.setup()
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))
        await user.click(screen.getByRole('button', { name: /Guardar/ }))
        await user.click(screen.getByTestId('btn-cancelar'))

        expect(screen.queryByTestId('modal-confirmacion')).not.toBeInTheDocument()
    })

    it('llama a guardarCambios al confirmar', async () => {
        const user = userEvent.setup()
        const guardarCambios = vi.fn().mockResolvedValue({ success: true })
        useDetalleLote.mockReturnValue({ ...hookBase, guardarCambios })
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))
        await user.click(screen.getByRole('button', { name: /Guardar/ }))
        await user.click(screen.getByTestId('btn-confirmar'))

        expect(guardarCambios).toHaveBeenCalledTimes(1)
    })

    it('muestra alerta de éxito tras guardar correctamente', async () => {
        const user = userEvent.setup()
        const guardarCambios = vi.fn().mockResolvedValue({ success: true })
        useDetalleLote.mockReturnValue({ ...hookBase, guardarCambios })
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))
        await user.click(screen.getByRole('button', { name: /Guardar/i }))
        await user.click(screen.getByTestId('btn-confirmar'))

        await waitFor(() => {
            expect(screen.getByTestId('modal-alerta')).toBeInTheDocument()
            expect(screen.getByTestId('modal-alerta')).toHaveAttribute('data-variante', 'exito')
            expect(screen.getByText('Cambios guardados exitosamente')).toBeInTheDocument()
        })
    })

    it('muestra alerta de error tras un fallo al guardar', async () => {
        const user = userEvent.setup()
        const guardarCambios = vi.fn().mockResolvedValue({ success: false, error: 'Fallo en servidor' })
        useDetalleLote.mockReturnValue({ ...hookBase, guardarCambios })
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))
        await user.click(screen.getByRole('button', { name: /Guardar/ }))
        await user.click(screen.getByTestId('btn-confirmar'))

        await waitFor(() => {
            expect(screen.getByTestId('modal-alerta')).toBeInTheDocument()
        })
        expect(screen.getByTestId('modal-alerta')).toHaveAttribute('data-variante', 'error')
        expect(screen.getByText('Error al guardar: Fallo en servidor')).toBeInTheDocument()
    })

    it('oculta el botón guardar tras guardar exitosamente', async () => {
        const user = userEvent.setup()
        const guardarCambios = vi.fn().mockResolvedValue({ success: true })
        useDetalleLote.mockReturnValue({ ...hookBase, guardarCambios })
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))
        await user.click(screen.getByRole('button', { name: /Guardar/ }))
        await user.click(screen.getByTestId('btn-confirmar'))

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /Guardar/ })).not.toBeInTheDocument()
        })
    })

    it('cierra la alerta al hacer click en cerrar', async () => {
        const user = userEvent.setup()
        const guardarCambios = vi.fn().mockResolvedValue({ success: true })
        useDetalleLote.mockReturnValue({ ...hookBase, guardarCambios })
        renderPagina()

        await user.click(screen.getByTestId('cambiar-fase'))
        await user.click(screen.getByRole('button', { name: /Guardar/ }))
        await user.click(screen.getByTestId('btn-confirmar'))

        await waitFor(() => expect(screen.getByTestId('btn-cerrar-alerta')).toBeInTheDocument())
        await user.click(screen.getByTestId('btn-cerrar-alerta'))

        expect(screen.queryByTestId('modal-alerta')).not.toBeInTheDocument()
    })
})
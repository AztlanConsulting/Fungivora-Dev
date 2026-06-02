import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BloqueNota from '../../../pages/bloques/NotasBloque'

// Mocks
vi.mock('../../../features/bloques/hooks/useNotasBloques')
import useNotasBloques from '../../../features/bloques/hooks/useNotasBloques'

vi.mock('../../../shared/components/ui/templates/Notas', () => ({
    default: ({ notas, cargando, error, onAgregar }) => (
        <div>
            {cargando && <p>Cargando notas...</p>}
            {error && <p>{error}</p>}
            {!cargando && !error && notas.length === 0 && (
                <p>Sin notas registradas.</p>
            )}
            {!cargando && notas.map((n) => ( 
                <div key={n.id_bitacora}>
                    <p>{n.notas_bitacora}</p>
                    {n.porc_colonizacion !== undefined && (
                        <p>Porcentaje de colonización: {Math.round(n.porc_colonizacion)}%</p>
                    )}
                </div>
            ))}
            <button onClick={() => onAgregar({ notas_bitacora: 'Nueva nota' })}>
                Agregar
            </button>
        </div>
    ),
}))

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useParams: () => ({ id_bloque: 'bloque-1' }),
        useLocation: () => ({ state: { codigoVisual: 'BC-TEST-1' } }),
    }
})

const hookBase = {
    notas: [],
    cargando: false,
    error: null,
    postNota: vi.fn(),
}

beforeEach(() => {
    vi.clearAllMocks()
    useNotasBloques.mockReturnValue(hookBase)
})

const renderVista = () =>
    render(
        <MemoryRouter initialEntries={['/bloques/bloque-1/notas']}>
            <Routes>
                <Route path="/bloques/:id_bloque/notas" element={<BloqueNota />} />
            </Routes>
        </MemoryRouter>
    )

// Renderizado base
describe('BloqueNota — renderizado base', () => {
    it('muestra mensaje cuando no hay notas', () => {
        renderVista()
        expect(screen.getByText('Sin notas registradas.')).toBeInTheDocument()
    })

    it('muestra el botón de agregar', () => {
        renderVista()
        expect(screen.getByRole('button', { name: /agregar/i })).toBeInTheDocument()
    })
})

// Estados
describe('BloqueNota — estados', () => {
    it('muestra mensaje de carga', () => {
        useNotasBloques.mockReturnValue({ ...hookBase, cargando: true })
        renderVista()
        expect(screen.getByText('Cargando notas...')).toBeInTheDocument()
    })

    it('muestra mensaje de error', () => {
        useNotasBloques.mockReturnValue({ ...hookBase, error: 'No se pudieron conseguir las notas' })
        renderVista()
        expect(screen.getByText('No se pudieron conseguir las notas')).toBeInTheDocument()
    })
})

// Renderizado de notas
describe('BloqueNota — notas', () => {
    const notasMock = [
        { id_bitacora: 1, fecha_bitacora: '2024-01-01', notas_bitacora: 'Primera nota', porc_colonizacion: 50 },
        { id_bitacora: 2, fecha_bitacora: '2024-01-02', notas_bitacora: 'Segunda nota', porc_colonizacion: 75 },
    ]

    it('renderiza el contenido de cada nota', () => {
        useNotasBloques.mockReturnValue({ ...hookBase, notas: notasMock })
        renderVista()
        expect(screen.getByText('Primera nota')).toBeInTheDocument()
        expect(screen.getByText('Segunda nota')).toBeInTheDocument()
    })

    it('muestra el porcentaje de colonización de cada nota', () => {
        useNotasBloques.mockReturnValue({ ...hookBase, notas: notasMock })
        renderVista()
        expect(screen.getByText('Porcentaje de colonización: 50%')).toBeInTheDocument()
        expect(screen.getByText('Porcentaje de colonización: 75%')).toBeInTheDocument()
    })

    it('no muestra notas mientras carga', () => {
        useNotasBloques.mockReturnValue({ ...hookBase, cargando: true, notas: notasMock })
        renderVista()
        expect(screen.queryByText('Primera nota')).not.toBeInTheDocument()
    })
})

// Flujo de agregar nota
describe('BloqueNota — agregar nota', () => {
    it('llama a postNota al hacer click en agregar', async () => {
        const user = userEvent.setup()
        const postNota = vi.fn().mockResolvedValue({})
        useNotasBloques.mockReturnValue({ ...hookBase, postNota })

        renderVista()

        await user.click(screen.getByRole('button', { name: /agregar/i }))

        await waitFor(() => {
            expect(postNota).toHaveBeenCalledWith(
                expect.objectContaining({ notas_bitacora: 'Nueva nota' })
            )
        })
    })

    it('llama a useNotasBloques con el id_bloque correcto', () => {
        renderVista()
        expect(useNotasBloques).toHaveBeenCalledWith('bloque-1')
    })
})
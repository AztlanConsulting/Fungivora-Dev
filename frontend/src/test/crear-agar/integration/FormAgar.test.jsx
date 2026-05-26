import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import FormAgar from '../../../features/crear-agar/components/FormAgar'

// Mocks de hooks 
vi.mock('../../../features/inoculos/hooks/useEspecies')
vi.mock('../../../shared/crear-inoculos/hooks/useInoculo')
vi.mock('../../../shared/crear-inoculos/hooks/useCategorias')
vi.mock('../../../features/crear-agar/hooks/useIngredientesAgar')

import useEspecies from '../../../features/inoculos/hooks/useEspecies'
import useInoculo from '../../../shared/crear-inoculos/hooks/useInoculo'
import useCategorias from '../../../shared/crear-inoculos/hooks/useCategorias'
import useIngredientesAgar from '../../../features/crear-agar/hooks/useIngredientesAgar'
import insumosService from '../../../shared/crear-inoculos/services/inoculos.service'

// Mock del servicio
vi.mock('../../../shared/crear-inoculos/services/inoculos.service', () => ({
    default: { postInoculo: vi.fn() },
}))

// Mocks de utilidades 
vi.mock('../../../shared/crear-inoculos/utils/generarCodigoInoculo', () => ({
    generarCodigos: vi.fn(() => ({ base: 'AG-SH-240526', lista: ['AG-SH-240526'] })),
    normalizarTipoInoculo: vi.fn(() => 'agar'),
}))

vi.mock('../../../shared/crear-inoculos/dto/crearInoculoDto', () => ({
    crearInoculoDTO: vi.fn((args) => ({ ...args, isDto: true })),
}))

vi.mock('../../../shared/utils/traducirError', () => ({
    traducirError: vi.fn((err) => ({
        variante: 'error',
        mensaje: err?.message || 'Error desconocido',
     })),
}))

// Mocks de componentes
vi.mock('../../../shared/crear-inoculos/components/SeleccionarCantidades', () => ({
    EntradaLista: () => <div data-testid="entrada-lista" />,
}))

vi.mock('../../../shared/crear-inoculos/components/Resumen', () => ({
    default: ({ children }) => (
        <div data-testid="resumen">
            {children}
        </div>
     ),
}))

vi.mock('../../../shared/components/ui/popups/ModalAlerta', () => ({
    default: ({ visible, mensaje, variante }) =>
        visible ? <div data-testid={`alerta-${variante}`}>{mensaje}</div> : null,
}))

vi.mock('../../../shared/components/ui/inputs/SeleccionarTexto', () => ({
    default: ({ value, onChange, placeholder, options = [], disabled }) => (
        <select value={value} onChange={onChange} disabled={disabled}>
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
     ),
}))

vi.mock('../../../shared/components/ui/inputs/InputCantidad', () => ({
    default: ({ value, onChange }) => (
        <input type="number" data-testid="input-cantidad" value={value} onChange={(e) => onChange(Number(e.target.value))} />
     ),
}))

vi.mock('../../../shared/components/ui/inputs/InputFecha', () => ({
    default: ({ value }) => <input readOnly value={value?.day || ''} />,
}))

vi.mock('../../../shared/components/ui/inputs/InputNota', () => ({
    default: ({ value, onChange }) => (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
     ),
}))

vi.mock('../../../shared/components/ui/buttons/Botones', () => ({
    default: ({ children, onClick, disabled, variant }) => (
        <button data-testid={`btn-${variant}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
     ),
}))

vi.mock('../../../shared/components/ui/basics/Titulo', () => ({
    default: ({ children }) => <h1>{children}</h1>,
}))

vi.mock('../../../shared/components/ui/basics/Texto', () => ({
    default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../shared/components/layout', () => ({
    Base: ({ children }) => <div>{children}</div>,
}))

vi.mock('../../../shared/components/ui/basics/Colores', () => ({
    colores: { gris: '#555', azul: '#3b3fb6', negro: '#000', grisClaro: '#EAEAEC' },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return { ...actual, useNavigate: () => mockNavigate }
})

const setupHooks = () => {
    useEspecies.mockReturnValue({
        especies: [{ especie: 'Shiitake' }],
        loading: false, error: null,
    })
    useInoculo.mockReturnValue({
        opciones: [{
            codigo: 'AG-001',
            label: 'AG-001 — Agar (100 ml)',
            raw: { tipo: 'Agar', cantidad_disponible: 100, id_inoculo: 15 },
        }],
        loading: false, error: null,
    })
    useCategorias.mockReturnValue({
        categorias: [
            { nombre_categoria: 'Especies', nombre_opcion: 'Shiitake', abreviatura_opcion: 'SH' },
        ],
        loading: false,
    })
    
    useIngredientesAgar.mockImplementation(({ codigoInoculo }) => {
        if (!codigoInoculo || codigoInoculo === "") {
            return { items: [], valores: { cantInoculo: '0' }, loading: false }
        }
        return { items: [], valores: { cantInoculo: '5' }, loading: false }
    })
}

beforeEach(() => {
    vi.clearAllMocks()
    setupHooks()
})

const renderForm = () =>
    render(
        <MemoryRouter>
            <FormAgar />
        </MemoryRouter>
    )

const completarForm = async (user) => {
    const [especie, inoculo] = screen.getAllByRole('combobox')
    await user.selectOptions(especie, 'Shiitake')
    await user.selectOptions(inoculo, 'AG-001')
}

describe('FormAgar', () => {
    it('renderiza el título, los selectores requeridos y el botón Registrar', () => {
        renderForm()
        expect(screen.getByRole('heading', { name: /crear agar/i })).toBeInTheDocument()
        expect(screen.getAllByRole('combobox')).toHaveLength(2)
        expect(screen.getByTestId('btn-registrar')).toBeInTheDocument()
    })

    it('el botón Registrar arranca deshabilitado y se habilita al seleccionar especie e inóculo', async () => {
        const user = userEvent.setup()
        renderForm()

        expect(screen.getByTestId('btn-registrar')).toBeDisabled()

        await completarForm(user)

        expect(screen.getByTestId('btn-registrar')).not.toBeDisabled()
    })

    it('deshabilita el botón Registrar si la cantidad de inóculo calculada es menor o igual a cero', async () => {
        const user = userEvent.setup()
        
        useIngredientesAgar.mockImplementation(() => ({
            items: [],
            valores: { cantInoculo: '0' },
            loading: false,
        }))

        renderForm()
        await completarForm(user)

        expect(screen.getByTestId('btn-registrar')).toBeDisabled()
    })

    it('postea los datos transformados por el DTO y navega a /inoculos con la alerta de éxito tras registrar', async () => {
        insumosService.postInoculo.mockResolvedValue({ success: true })
        const user = userEvent.setup()
        renderForm()

        await completarForm(user)
        await user.click(screen.getByTestId('btn-registrar'))

        await waitFor(() => {
            expect(insumosService.postInoculo).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith(
                '/inoculos',
                expect.objectContaining({
                    state: expect.objectContaining({
                        alerta: expect.objectContaining({
                            variante: 'exito',
                            mensaje: expect.stringContaining('AG-SH-240526')
                        }),
                    }),
                })
            )
        })
    })

    it('muestra el ModalAlerta de error cuando la petición POST falla', async () => {
        insumosService.postInoculo.mockRejectedValue(new Error('ERROR_DE_ALMACENAMIENTO'))
        const user = userEvent.setup()
        renderForm()

        await completarForm(user)
        await user.click(screen.getByTestId('btn-registrar'))

        await waitFor(() => {
            expect(screen.getByTestId('alerta-error')).toBeInTheDocument()
            expect(screen.getByText('ERROR_DE_ALMACENAMIENTO')).toBeInTheDocument()
        })
    })
})
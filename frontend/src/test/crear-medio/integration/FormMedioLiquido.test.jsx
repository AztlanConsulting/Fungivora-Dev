import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import FormMedioLiquido from '../../../features/crear-medio/components/FormMedioLiquido'
import useEspecies from '../../../features/inoculos/hooks/useEspecies'
import useInoculo from '../../../features/crear-medio/hooks/useInoculo'
import useCategorias from '../../../features/crear-medio/hooks/useCategorias'
import useIngredientesMedioLiquido from '../../../features/crear-medio/hooks/useIngredientesMedioLiquido'
import insumosService from '../../../features/crear-medio/services/inoculos.service'

vi.mock('../../../features/inoculos/hooks/useEspecies')
vi.mock('../../../features/crear-medio/hooks/useInoculo')
vi.mock('../../../features/crear-medio/hooks/useCategorias')
vi.mock('../../../features/crear-medio/hooks/useIngredientesMedioLiquido')

vi.mock('../../../features/crear-medio/services/inoculos.service', () => ({
    default: { postInoculo: vi.fn() },
}))

vi.mock('../../../features/crear-medio/utils/generarCodigoInoculo', () => ({
    generarCodigos: vi.fn(() => ({ base: 'ML-SH-200526', lista: ['ML-SH-200526'] })),
    normalizarTipoInoculo: vi.fn(() => 'agar'),
}))

vi.mock('../../../features/crear-medio/dto/crearInoculoDto', () => ({
    crearInoculoDTO: vi.fn((args) => ({ ...args, isDto: true })),
}))

vi.mock('../../../shared/utils/traducirError', () => ({
    traducirError: vi.fn((err) => ({
        variante: 'error',
        mensaje: err?.message || 'Error desconocido',
    })),
}))

vi.mock('../../../features/crear-medio/components/SeleccionarCantidades', () => ({
    EntradaLista: () => <div data-testid="entrada-lista" />,
}))

vi.mock('../../../features/crear-medio/components/ResumenSemilla', () => ({
    default: () => <div data-testid="resumen" />,
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

vi.mock('../../../shared/components/ui/inputs/input_cantidad', () => ({
    default: ({ value, onChange }) => (
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    ),
}))

vi.mock('../../../shared/components/ui/inputs/InputFecha', () => ({
    default: ({ value }) => <input readOnly value={value?.day || ''} />,
}))

vi.mock('../../../shared/components/ui/inputs/input_nota', () => ({
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
            codigo: 'ML-001',
            label: 'ML-001 — Medio Líquido (100 ml)',
            raw: { tipo: 'Medio Líquido', cantidad_disponible: 100, id_inoculo: 42 },
        }],
        loading: false, error: null,
    })
    useCategorias.mockReturnValue({
        categorias: [
            { nombre_categoria: 'Especies', nombre_opcion: 'Shiitake', abreviatura_opcion: 'SH' },
        ],
        loading: false,
    })
    useIngredientesMedioLiquido.mockReturnValue({
        items: [],
        valores: { cantInoculo: '1' },
        loading: false,
    })
}

beforeEach(() => {
    vi.clearAllMocks()
    setupHooks()
})

const renderForm = () =>
    render(
        <MemoryRouter>
            <FormMedioLiquido />
        </MemoryRouter>
    )

const completarForm = async (user) => {
    const [especie, inoculo, carbohidrato] = screen.getAllByRole('combobox')
    await user.selectOptions(especie, 'Shiitake')
    await user.selectOptions(inoculo, 'ML-001')
    await user.selectOptions(carbohidrato, 'miel')
}

describe('FormMedioLiquido', () => {
    it('renderiza los 3 selectores y el botón Registrar', () => {
        renderForm()
        expect(screen.getAllByRole('combobox')).toHaveLength(3)
        expect(screen.getByTestId('btn-registrar')).toBeInTheDocument()
    })

    it('Registrar arranca deshabilitado y se habilita al completar los campos requeridos', async () => {
        const user = userEvent.setup()
        renderForm()

        expect(screen.getByTestId('btn-registrar')).toBeDisabled()

        await completarForm(user)

        expect(screen.getByTestId('btn-registrar')).not.toBeDisabled()
    })

    it('postea y navega a /inoculos con alerta de éxito tras un submit válido', async () => {
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
                        alerta: expect.objectContaining({ variante: 'exito' }),
                    }),
                })
            )
        })
    })

    it('muestra ModalAlerta de error cuando el POST falla', async () => {
        insumosService.postInoculo.mockRejectedValue(new Error('STOCK_INSUFICIENTE'))
        const user = userEvent.setup()
        renderForm()

        await completarForm(user)
        await user.click(screen.getByTestId('btn-registrar'))

        await waitFor(() => {
            expect(screen.getByTestId('alerta-error')).toBeInTheDocument()
        })
    })
})
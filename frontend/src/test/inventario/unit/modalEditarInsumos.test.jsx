import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ModalEditarInsumo from '../../../features/inventario/components/ModalEditarInsumos'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../../shared/components/ui/basics/texto', () => ({
    default: ({ children, ...props }) => <p {...props}>{children}</p>
}))
vi.mock('../../../shared/components/ui/inputs/input_texto', () => ({
    default: ({ placeholder, value, onChange }) => (
        <input placeholder={placeholder} value={value} onChange={onChange} />
    )
}))
vi.mock('../../../shared/components/ui/inputs/seleccionar_texto', () => ({
    default: ({ placeholder, value, onChange, options }) => (
        <select value={value} onChange={onChange}>
            <option value="">{placeholder}</option>
            {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    )
}))
vi.mock('../../../shared/components/ui/buttons/botones', () => ({
    default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>
}))

// ─── Datos de prueba ──────────────────────────────────────────────────────────

const insumoMock = {
    id_insumo: '3e1c3f1e-b3bf-4539-8893-ed87ce81267b',
    nombre: 'Agar agar',
    unidad: 'Gramo(s)',
    stock_recomendado: 100,
}

const unidadesMock = [
    { opcion: 'Gramo(s)' },
    { opcion: 'Mililitro(s)' },
    { opcion: 'Kilogramo(s)' },
]

const onConfirmMock = vi.fn()
const onCancelMock = vi.fn()

// ─── Helper ───────────────────────────────────────────────────────────────────

const renderModal = (props = {}) =>
    render(
        <ModalEditarInsumo
            insumo={insumoMock}
            unidades={unidadesMock}
            onConfirm={onConfirmMock}
            onCancel={onCancelMock}
            {...props}
        />
    )

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    vi.clearAllMocks()
})

describe('ModalEditarInsumo — renderizado base', () => {

    it('muestra el título "Editar Insumo"', () => {
        renderModal()
        expect(screen.getByText('Editar Insumo')).toBeInTheDocument()
    })

    it('precarga el nombre del insumo', () => {
        renderModal()
        expect(screen.getByDisplayValue('Agar agar')).toBeInTheDocument()
    })

    it('precarga la unidad del insumo', () => {
        renderModal()
        expect(screen.getByDisplayValue('Gramo(s)')).toBeInTheDocument()
    })

    it('precarga el stock recomendado del insumo', () => {
        renderModal()
        expect(screen.getByDisplayValue('100')).toBeInTheDocument()
    })

    it('muestra los botones Cancelar y Guardar', () => {
        renderModal()
        expect(screen.getByText('Cancelar')).toBeInTheDocument()
        expect(screen.getByText('Guardar')).toBeInTheDocument()
    })
})

describe('ModalEditarInsumo — validaciones', () => {

    it('muestra error si el nombre está vacío', async () => {
        const user = userEvent.setup()
        renderModal()

        await user.clear(screen.getByDisplayValue('Agar agar'))
        await user.click(screen.getByText('Guardar'))

        expect(screen.getByText('El nombre no puede estar vacío')).toBeInTheDocument()
        expect(onConfirmMock).not.toHaveBeenCalled()
    })

    it('muestra error si no hay unidad seleccionada', async () => {
        const user = userEvent.setup()
        renderModal()

        await user.selectOptions(screen.getByRole('combobox'), '')
        await user.click(screen.getByText('Guardar'))

        expect(screen.getByText('Selecciona una unidad')).toBeInTheDocument()
        expect(onConfirmMock).not.toHaveBeenCalled()
    })

    it('muestra error si el stock recomendado es 0', async () => {
        const user = userEvent.setup()
        renderModal()

        await user.clear(screen.getByDisplayValue('100'))
        await user.type(screen.getByPlaceholderText('0.00'), '0')
        await user.click(screen.getByText('Guardar'))

        expect(screen.getByText('El stock recomendado debe ser mayor a 0')).toBeInTheDocument()
        expect(onConfirmMock).not.toHaveBeenCalled()
    })
})

describe('ModalEditarInsumo — paso de confirmación', () => {

    it('muestra el resumen de cambios al hacer clic en Guardar con datos válidos', async () => {
        const user = userEvent.setup()
        renderModal()

        await user.click(screen.getByText('Guardar'))

        expect(screen.getByText('Confirme los siguientes cambios')).toBeInTheDocument()
        expect(screen.getByText('Agar agar')).toBeInTheDocument()
        expect(screen.getByText('Gramo(s)')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('muestra los botones Regresar y Confirmar en el paso de confirmación', async () => {
        const user = userEvent.setup()
        renderModal()

        await user.click(screen.getByText('Guardar'))

        expect(screen.getByText('Cancelar')).toBeInTheDocument()
        expect(screen.getByText('Confirmar')).toBeInTheDocument()
    })

    it('regresa al formulario al hacer clic en Regresar', async () => {
        const user = userEvent.setup()
        renderModal()

        await user.click(screen.getByText('Guardar'))
        await user.click(screen.getByText('Cancelar'))

        expect(screen.getByText('Guardar')).toBeInTheDocument()
        expect(screen.queryByText('¿Confirmas los siguientes cambios?')).not.toBeInTheDocument()
    })

    it('llama a onConfirm con los datos correctos al confirmar', async () => {
        const user = userEvent.setup()
        onConfirmMock.mockResolvedValue(true)
        renderModal()

        await user.click(screen.getByText('Guardar'))
        await user.click(screen.getByText('Confirmar'))

        await waitFor(() => {
            expect(onConfirmMock).toHaveBeenCalledWith(
                '3e1c3f1e-b3bf-4539-8893-ed87ce81267b',
                {
                    nombre: 'Agar agar',
                    unidad: 'Gramo(s)',
                    stock_recomendado: 100,
                }
            )
        })
    })

    it('muestra error y regresa al formulario si onConfirm falla', async () => {
        const user = userEvent.setup()
        onConfirmMock.mockResolvedValue(false)
        renderModal()

        await user.click(screen.getByText('Guardar'))
        await user.click(screen.getByText('Confirmar'))

        await waitFor(() => {
            expect(screen.getByText('No se pudo guardar. Intenta de nuevo.')).toBeInTheDocument()
            expect(screen.getByText('Guardar')).toBeInTheDocument()
        })
    })
})

describe('ModalEditarInsumo — cancelar', () => {

    it('llama a onCancel al hacer clic en Cancelar', async () => {
        const user = userEvent.setup()
        renderModal()

        await user.click(screen.getByText('Cancelar'))

        expect(onCancelMock).toHaveBeenCalledTimes(1)
    })

    it('llama a onCancel al hacer clic en el fondo oscuro', async () => {
        const user = userEvent.setup()
        const { container } = renderModal()

        const backdrop = container.querySelector('.absolute.inset-0')
        await user.click(backdrop)

        expect(onCancelMock).toHaveBeenCalledTimes(1)
    })
})
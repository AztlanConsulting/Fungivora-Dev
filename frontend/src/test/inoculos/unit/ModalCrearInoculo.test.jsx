import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ModalCrearInoculo from '../../../features/inoculos/components/ModalCrearInoculo'

// Mock de componentes UI compartidos
vi.mock('../../../shared/components/ui/basics/texto', () => ({
    default: ({ children }) => <p>{children}</p>,
}))
vi.mock('../../../shared/components/ui/buttons/botones', () => ({
    default: ({ children, onClick }) => (
        <button onClick={onClick}>{children}</button>
    ),
}))
vi.mock('../../../shared/components/ui/inputs/seleccionar_texto', () => ({
    default: ({ value, onChange, options }) => (
        <select value={value} onChange={onChange} data-testid="select-tipo">
            {options.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
            ))}
        </select>
    ),
}))
vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <span data-testid="icon-cerrar" />,
}))
vi.mock('@hugeicons/core-free-icons', () => ({
    Cancel01Icon: {},
}))

// Helper 

const renderModal = (props = {}) => {
    const defaults = {
        visible: true,
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
    }
    return render(<ModalCrearInoculo {...defaults} {...props} />)
}

// Visibilidad 

describe('ModalCrearInoculo — visibilidad', () => {
    it('no renderiza nada cuando visible es false', () => {
        renderModal({ visible: false })
        expect(screen.queryByText('¿Qué tipo de inóculo quieres crear?')).not.toBeInTheDocument()
    })

    it('renderiza el modal cuando visible es true', () => {
        renderModal()
        expect(screen.getByText('¿Qué tipo de inóculo quieres crear?')).toBeInTheDocument()
    })
})

// Renderizado 

describe('ModalCrearInoculo — renderizado', () => {
    it('muestra el select de tipo', () => {
        renderModal()
        expect(screen.getByTestId('select-tipo')).toBeInTheDocument()
    })

    it('muestra el botón de confirmar', () => {
        renderModal()
        expect(screen.getByText('Confirmar')).toBeInTheDocument()
    })

    it('muestra el botón de cancelar', () => {
        renderModal()
        expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })

    it('muestra el botón de cerrar (X)', () => {
        renderModal()
        expect(screen.getByTestId('icon-cerrar')).toBeInTheDocument()
    })

    it('muestra agar como opción por defecto', () => {
        renderModal()
        expect(screen.getByDisplayValue('Agar')).toBeInTheDocument()
    })
})

// Interacciones 

describe('ModalCrearInoculo — interacciones', () => {
    it('llama a onConfirm con el tipo seleccionado al confirmar', async () => {
        const user = userEvent.setup()
        const onConfirm = vi.fn()
        renderModal({ onConfirm })

        await user.click(screen.getByText('Confirmar'))
        expect(onConfirm).toHaveBeenCalledWith('Agar')
    })

    it('llama a onConfirm con el tipo correcto tras cambiar el select', async () => {
        const user = userEvent.setup()
        const onConfirm = vi.fn()
        renderModal({ onConfirm })

        await user.selectOptions(screen.getByTestId('select-tipo'), 'Semilla')
        await user.click(screen.getByText('Confirmar'))

        expect(onConfirm).toHaveBeenCalledWith('Semilla')
    })

    it('llama a onCancel al hacer click en Cancelar', async () => {
        const user = userEvent.setup()
        const onCancel = vi.fn()
        renderModal({ onCancel })

        await user.click(screen.getByText('Cancelar'))
        expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('llama a onCancel al hacer click en el overlay', async () => {
        const user = userEvent.setup()
        const onCancel = vi.fn()
        renderModal({ onCancel })

        // El overlay es el div con clase absolute inset-0
        const overlay = document.querySelector('.absolute.inset-0')
        await user.click(overlay)
        expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('resetea el select a agar después de confirmar', async () => {
        const user = userEvent.setup()
        const onConfirm = vi.fn()
        const { rerender } = renderModal({ onConfirm })

        await user.selectOptions(screen.getByTestId('select-tipo'), 'Medio Líquido')
        await user.click(screen.getByText('Confirmar'))

        rerender(<ModalCrearInoculo visible={true} onConfirm={onConfirm} onCancel={vi.fn()} />)

        expect(screen.getByDisplayValue('Agar')).toBeInTheDocument()
    })
})
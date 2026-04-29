import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../../../shared/components/ui'

// Helper para renderizar con onChange mockeado
const renderInput = (props = {}) => {
    const onChange = props.onChange ?? vi.fn()
    const utils = render(
        <Input value="" onChange={onChange} {...props} />
    )
    return { ...utils, onChange }
}

// Variante "normal"
describe('Input - variante normal', () => {
    it('renderiza un <input> en vez de un <textarea>', () => {
        renderInput({ placeholder: 'Escribe...' })
        expect(screen.getByText('Escribe...')).toBeInTheDocument()
    })

    it('oculta el placeholder cuando hay valor', () => {
        renderInput({ value: 'Rigby', placeholder: 'Escribe...' })
        expect(screen.queryByText('Escribe...')).not.toBeInTheDocument()
    })

    it('llama a onChange al escribir', async () => {
        const user = userEvent.setup()
        const { onChange } = renderInput()
        await user.type(screen.getByRole('textbox'), 'input de user')
        expect(onChange).toHaveBeenCalled()
    })

    it('agrega ring-4 al recibir foco y lo quita al perderlo', async () => {
        const user = userEvent.setup()
        renderInput()
        const input = screen.getByRole('textbox')

        await user.click(input)
        expect(input.closest('div')).toHaveClass('ring-4')

        await user.tab()
        expect(input.closest('div')).toHaveClass('ring-2')
        expect(input.closest('div')).not.toHaveClass('ring-4')
    })

    it('bloquea caracteres peligrosos (< > { } etc.)', async () => {
        const user = userEvent.setup()
        const { onChange } = renderInput()
        const input = screen.getByRole('textbox')

        await user.click(input)
        await user.keyboard('{<}')
        expect(onChange).not.toHaveBeenCalled()

        await user.keyboard('{{}')
        expect(onChange).not.toHaveBeenCalled()
    })

    it('acepta texto normal sin bloquear', async () => {
        const user = userEvent.setup()
        const { onChange } = renderInput()
        await user.type(screen.getByRole('textbox'), 'input de user')
        expect(onChange).toHaveBeenCalled()
    })
})

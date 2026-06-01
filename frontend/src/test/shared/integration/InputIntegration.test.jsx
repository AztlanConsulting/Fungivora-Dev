import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../../../shared/components/ui'

function ConjuntoPrueba({ onSubmit }) {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [peso, setPeso] = useState('')

    const handleSubmit = () => {
        onSubmit({ nombre, descripcion, cantidad, peso })
    }

    return (
        <div>
            {/* Input normal */}
            <Input
                variante="normal"
                placeholder="Nombre del lote"
                aria-label="Nombre del lote"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />

            {/* Input amplio */}
            <Input
                variante="amplio"
                placeholder="Descripción detallada"
                aria-label="Descripción detallada"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />

            {/* Input entero */}
            <Input
                variante="numero"
                numeroTipo="entero"
                placeholder="0"
                aria-label="cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
            />

            {/* Input decimal */}
            <Input
                variante="numero"
                numeroTipo="decimal"
                placeholder="0.00"
                aria-label="peso"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
            />

            <button onClick={handleSubmit}>Guardar</button>
        </div>
    )
}

describe('Integración — formulario con todos los tipos de Input', () => {
    it('captura valores de todos los inputs y los envía correctamente', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<ConjuntoPrueba onSubmit={onSubmit} />)

        const inputNombre      = screen.getByRole('textbox', { name: 'Nombre del lote' })
        const inputDescripcion = screen.getByRole('textbox', { name: 'Descripción detallada' })
        const inputCantidad    = screen.getByRole('textbox', { name: 'cantidad' })
        const inputPeso        = screen.getByRole('textbox', { name: 'peso' })

        await user.type(inputNombre, 'Lote Shiitake')
        await user.type(inputDescripcion, 'Primera inoculación del año')
        await user.type(inputCantidad, '50')
        await user.type(inputPeso, '12.5') 

        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(onSubmit).toHaveBeenCalledWith({
            nombre: 'Lote Shiitake',
            descripcion: 'Primera inoculación del año',
            cantidad: '50',
            peso: '12.5', 
        })
    })

    it('flujo completo: escribir → limpiar → reescribir', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<ConjuntoPrueba onSubmit={onSubmit} />)

        const inputNombre = screen.getByRole('textbox', { name: 'Nombre del lote' })

        await user.type(inputNombre, 'Nombre equivocado')
        await user.clear(inputNombre)
        await user.type(inputNombre, 'Nombre correcto')

        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ nombre: 'Nombre correcto' })
        )
    })

    it('Tab pasa por todos los inputs', async () => {
        const user = userEvent.setup()
        render(<ConjuntoPrueba onSubmit={vi.fn()} />)

        const inputNombre      = screen.getByRole('textbox', { name: 'Nombre del lote' })
        const inputDescripcion = screen.getByRole('textbox', { name: 'Descripción detallada' })
        const inputCantidad    = screen.getByRole('textbox', { name: 'cantidad' })
        const inputPeso        = screen.getByRole('textbox', { name: 'peso' })

        await user.tab()
        expect(inputNombre).toHaveFocus()

        await user.tab()
        expect(inputDescripcion).toHaveFocus()

        await user.tab()
        expect(inputCantidad).toHaveFocus()

        await user.tab()
        expect(inputPeso).toHaveFocus()
    })
})
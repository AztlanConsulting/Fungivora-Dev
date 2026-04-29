import React, { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../../../shared/components/ui'

// Formulario de prueba que combina los tres tipos de input y los dos tipos de entrada númerica
function ConjuntoPrueba({ onSubmit }) {
    // Variables de los inputs
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
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />

            {/* Input amplio */}
            <Input
                variante="amplio"
                placeholder="Descripción detallada"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />

            {/* Input entero */}
            <Input
                variante="numero"
                numeroTipo="entero"
                placeholder="0"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
            />

            {/* Input decimal */}
            <Input
                variante="numero"
                numeroTipo="decimal"
                placeholder="0.00"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
            />

            {/* Botón de envío, podría ser reemplazado por Button de los components */}
            <button onClick={handleSubmit}>Guardar</button>
        </div>
    )
}

// Pruebas
describe('Integración — formulario con todos los tipos de Input', () => {
    it('captura valores de todos los inputs y los envía correctamente', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<ConjuntoPrueba onSubmit={onSubmit} />)

        const inputs = screen.getAllByRole('textbox')

        // normal
        await user.type(inputs[0], 'Lote Shiitake')
        // amplio (textarea)
        await user.type(inputs[1], 'Primera inoculación del año')
        // numero entero
        await user.type(inputs[2], '50')
        // numero decimal
        await user.type(inputs[3], '12.50')

        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(onSubmit).toHaveBeenCalledWith({
            nombre: 'Lote Shiitake',
            descripcion: 'Primera inoculación del año',
            cantidad: '50',
            peso: '12.50',
        })
    })

    it('flujo completo: escribir → limpiar → reescribir', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<ConjuntoPrueba onSubmit={onSubmit} />)

        const inputNombre = screen.getAllByRole('textbox')[0]

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

        await user.tab()
        expect(screen.getAllByRole('textbox')[0]).toHaveFocus()

        await user.tab()
        expect(screen.getAllByRole('textbox')[1]).toHaveFocus()

        await user.tab()
        expect(screen.getAllByRole('textbox')[2]).toHaveFocus()

        await user.tab()
        expect(screen.getAllByRole('textbox')[3]).toHaveFocus()
    })
})
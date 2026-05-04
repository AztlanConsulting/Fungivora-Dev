import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Barra_navegacion from '../../../shared/components/layout/Barra_navegacion'

vi.mock('/icons/icon-splash-blue.png', () => ({ default: 'logo-mock' }))

vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <div data-testid="icon" />
}))

const renderNavbar = () => render(
    <BrowserRouter>
        <Barra_navegacion />
    </BrowserRouter>
)

describe('Pruebas de navegacion - Configuracion', () => {
    beforeEach(() => {
        renderNavbar()
    })

    it('Los links estan en el componente', () => {
        const rutas = ['/first', '/lotes', '/inventario', '/inoculos']

        rutas.forEach(ruta => {
            const link = document.querySelector(`a[href="${ruta}"]`)
            expect(link).not.toBeNull()
        })
    })

    it('Los links estan donde deberian estar junto con su tooltip', () => {
        const linkInicio = screen.getByText(/inicio/i).closest('a')
        const linkLotes = screen.getByText(/lotes/i).closest('a')
        const linkInventario = screen.getByText(/inventario/i).closest('a')
        const linkBiblioteca = screen.getByText(/biblioteca genética/i).closest('a')

        expect(linkInicio).toHaveAttribute('href', '/first')
        expect(linkLotes).toHaveAttribute('href', '/lotes')
        expect(linkInventario).toHaveAttribute('href', '/inventario')
        expect(linkBiblioteca).toHaveAttribute('href', '/inoculos')
    })
})

describe('Pruebas de navegacion - Funcionalidad', () => {
    beforeEach(() => {
        renderNavbar()
    })

    it('El usuario se mueve a Lotes', async () => {
        const user = userEvent.setup()
        const linkLotes = screen.getByText(/lotes/i).closest('a')

        await user.click(linkLotes)

        expect(window.location.pathname).toBe('/lotes')
    })

    it('El usuario se mueve a Inicio', async () => {
        const user = userEvent.setup()
        const linkInicio = screen.getByText(/inicio/i).closest('a')

        await user.click(linkInicio)

        expect(window.location.pathname).toBe('/first')
    })

    it('El usuario se mueve a Inventario', async () => {
        const user = userEvent.setup()
        const linkInventario = screen.getByText(/inventario/i).closest('a')

        await user.click(linkInventario)

        expect(window.location.pathname).toBe('/inventario')
    })

    it('El usuario se mueve a Biblioteca genetica', async () => {
        const user = userEvent.setup()
        const linkBiblioteca = screen.getByText(/biblioteca genética/i).closest('a')

        await user.click(linkBiblioteca)

        expect(window.location.pathname).toBe('/inoculos')
    })
})
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import InfoLote from '../../../features/lotes/components/InfoLote'

// Mock de Text para aislar InfoLote de la tipografía
vi.mock('../../../shared/components/ui/basics/texto', () => ({
    default: ({ children, variante, style }) => (
        <p data-testid="text" data-variante={variante} style={style}>
            {children}
        </p>
    ),
}))

// Mock de HugeiconsIcon
vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: ({ size, color }) => (
        <span data-testid="icon" data-size={size} data-color={color} />
    ),
}))

// Mock de colores (objeto plano)
vi.mock('../../../shared/components/ui/basics/colores', () => ({
    colores: { azul: '#3b3fb6' },
}))

// Datos de prueba 

const IconMock = {}

const renderComponente = (props = {}) =>
    render(
        <InfoLote
            icon={IconMock}
            label="Fecha de creación"
            value="27/04/2026"
            {...props}
        />
    )

beforeEach(() => {
    vi.clearAllMocks()
})

// Renderizado base 

describe('InfoLote — renderizado base', () => {
    it('renderiza sin errores', () => {
        expect(() => renderComponente()).not.toThrow()
    })

    it('muestra el label', () => {
        renderComponente()
        expect(screen.getByText('Fecha de creación')).toBeInTheDocument()
    })

    it('muestra el value', () => {
        renderComponente()
        expect(screen.getByText('27/04/2026')).toBeInTheDocument()
    })

    it('renderiza el ícono', () => {
        renderComponente()
        expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
})

// Ícono 

describe('InfoLote — ícono', () => {
    it('pasa size=36 al ícono', () => {
        renderComponente()
        expect(screen.getByTestId('icon')).toHaveAttribute('data-size', '36')
    })

    it('pasa el color azul al ícono', () => {
        renderComponente()
        expect(screen.getByTestId('icon')).toHaveAttribute('data-color', '#3b3fb6')
    })
})

// Variantes de Text 

describe('InfoLote — variantes de Text', () => {
    it('el label usa la variante "body"', () => {
        renderComponente()
        const textos = screen.getAllByTestId('text')
        const labelEl = textos.find((el) => el.textContent === 'Fecha de creación')
        expect(labelEl).toHaveAttribute('data-variante', 'body')
    })

    it('el value usa la variante "option"', () => {
        renderComponente()
        const textos = screen.getAllByTestId('text')
        const valueEl = textos.find((el) => el.textContent === '27/04/2026')
        expect(valueEl).toHaveAttribute('data-variante', 'option')
    })
})

// showDivider 

describe('InfoLote — showDivider', () => {
    it('muestra el divisor por defecto (showDivider=true)', () => {
        const { container } = renderComponente()
        // El divisor tiene clases específicas que lo identifican
        const divider = container.querySelector('.bg-gray-100.w-\\[1px\\]')
        expect(divider).toBeInTheDocument()
    })

    it('oculta el divisor cuando showDivider=false', () => {
        const { container } = renderComponente({ showDivider: false })
        const divider = container.querySelector('.bg-gray-100.w-\\[1px\\]')
        expect(divider).not.toBeInTheDocument()
    })

    it('muestra el divisor cuando showDivider=true explícito', () => {
        const { container } = renderComponente({ showDivider: true })
        const divider = container.querySelector('.bg-gray-100.w-\\[1px\\]')
        expect(divider).toBeInTheDocument()
    })
})

// Props dinámicas 

describe('InfoLote — props dinámicas', () => {
    it('muestra un label diferente correctamente', () => {
        renderComponente({ label: 'Especie' })
        expect(screen.getByText('Especie')).toBeInTheDocument()
    })

    it('muestra un value diferente correctamente', () => {
        renderComponente({ value: 'Pleurotus Ostreatus' })
        expect(screen.getByText('Pleurotus Ostreatus')).toBeInTheDocument()
    })

    it('muestra value como string vacío sin romper el render', () => {
        expect(() => renderComponente({ value: '' })).not.toThrow()
    })
})
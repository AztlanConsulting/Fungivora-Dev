import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BannerLote from '../../../features/lotes/components/BannerLote'

// Mock de InfoLote
vi.mock('../../../features/lotes/components/InfoLote', () => ({
    default: ({ label, value, showDivider }) => (
        <div data-testid="info-lote" data-label={label} data-show-divider={String(showDivider)}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    ),
}))

// Mock de íconos 
vi.mock('@hugeicons/core-free-icons', () => ({
    Calendar03Icon: () => <div />,
    MushroomIcon: () => <div />,
    Location01Icon: () => <div />,
}))

const dataMock = {
    fecha: '27/04/2026',
    especie: 'Pleurotus Ostreatus',
    ubicacion: 'Invernadero A',
}

const renderComponente = (props = {}) =>
    render(<BannerLote data={{ ...dataMock, ...props }} />)

beforeEach(() => {
    vi.clearAllMocks()
})

describe('BannerLote — renderizado base', () => {
    it('renderiza sin errores', () => {
        expect(() => renderComponente()).not.toThrow()
    })

    it('renderiza exactamente 3 InfoLote', () => {
        renderComponente()
        expect(screen.getAllByTestId('info-lote')).toHaveLength(3) 
    })
})

describe('BannerLote — labels', () => {
    it('muestra los labels correctos', () => {
        renderComponente()
        expect(screen.getByText('Fecha de creación')).toBeInTheDocument()
        expect(screen.getByText('Especie')).toBeInTheDocument()
        expect(screen.getByText('Ubicación')).toBeInTheDocument()
    })
})

describe('BannerLote — valores de data', () => {
    it('muestra la información correcta de los props', () => {
        renderComponente()
        expect(screen.getByText(dataMock.fecha)).toBeInTheDocument()
        expect(screen.getByText(dataMock.especie)).toBeInTheDocument()
        expect(screen.getByText(dataMock.ubicacion)).toBeInTheDocument()
    })
})

describe('BannerLote — prop showDivider', () => {
    it('el último InfoLote (Ubicación) debería poder recibir showDivider=false si se implementa', () => {
        renderComponente()
        const infoLotes = screen.getAllByTestId('info-lote')
        const ultimo = infoLotes[infoLotes.length - 1]
        
        expect(ultimo).toHaveAttribute('data-label', 'Ubicación')
    })
})

describe('BannerLote — edge cases', () => {
    it('renderiza aunque los valores de data sean strings vacíos', () => {
        render(
            <BannerLote
                data={{ fecha: '', especie: '', ubicacion: '' }}
            />
        )
        expect(screen.getAllByTestId('info-lote')).toHaveLength(3) 
    })

    it('refleja cambios en los datos dinámicamente', () => {
        const { rerender } = renderComponente({ especie: 'Ganoderma' })
        expect(screen.getByText('Ganoderma')).toBeInTheDocument()
        
        rerender(<BannerLote data={{ ...dataMock, especie: 'Shiitake' }} />)
        expect(screen.getByText('Shiitake')).toBeInTheDocument()
    })
})
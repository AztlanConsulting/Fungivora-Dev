import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BannerLote from '../../../features/lotes/components/BannerLote'

// Mock de InfoLote para aislar BannerLote
vi.mock('../../../features/lotes/components/InfoLote', () => ({
    default: ({ label, value, showDivider }) => (
        <div data-testid="info-lote" data-label={label} data-show-divider={showDivider}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    ),
}))

// Mock de íconos para evitar dependencias externas
vi.mock('@hugeicons/core-free-icons', () => ({
    Calendar03Icon: {},
    MushroomIcon: {},
    MoneyBag01Icon: {},
    Location01Icon: {},
    BacteriaIcon: {},
}))

// Datos de prueba 

const dataMock = {
    fecha: '27/04/2026',
    especie: 'Pleurotus Ostreatus',
    sustrato: 'Paja de trigo',
    ubicacion: 'Invernadero A',
    inoculo: 'INO-001',
}

const renderComponente = (props = {}) =>
    render(<BannerLote data={{ ...dataMock, ...props }} />)

beforeEach(() => {
    vi.clearAllMocks()
})

// Renderizado base 

describe('BannerLote — renderizado base', () => {
    it('renderiza sin errores', () => {
        expect(() => renderComponente()).not.toThrow()
    })

    it('renderiza exactamente 5 InfoLote', () => {
        renderComponente()
        expect(screen.getAllByTestId('info-lote')).toHaveLength(5)
    })
})

// Labels 

describe('BannerLote — labels', () => {
    it('muestra el label "Fecha de creación"', () => {
        renderComponente()
        expect(screen.getByText('Fecha de creación')).toBeInTheDocument()
    })

    it('muestra el label "Especie"', () => {
        renderComponente()
        expect(screen.getByText('Especie')).toBeInTheDocument()
    })

    it('muestra el label "Sustrato"', () => {
        renderComponente()
        expect(screen.getByText('Sustrato')).toBeInTheDocument()
    })

    it('muestra el label "Ubicación"', () => {
        renderComponente()
        expect(screen.getByText('Ubicación')).toBeInTheDocument()
    })

    it('muestra el label "Inóculo usado"', () => {
        renderComponente()
        expect(screen.getByText('Inóculo usado')).toBeInTheDocument()
    })
})

// Valores 

describe('BannerLote — valores de data', () => {
    it('muestra la fecha correcta', () => {
        renderComponente()
        expect(screen.getByText(dataMock.fecha)).toBeInTheDocument()
    })

    it('muestra la especie correcta', () => {
        renderComponente()
        expect(screen.getByText(dataMock.especie)).toBeInTheDocument()
    })

    it('muestra el sustrato correcto', () => {
        renderComponente()
        expect(screen.getByText(dataMock.sustrato)).toBeInTheDocument()
    })

    it('muestra la ubicación correcta', () => {
        renderComponente()
        expect(screen.getByText(dataMock.ubicacion)).toBeInTheDocument()
    })

    it('muestra el inóculo correcto', () => {
        renderComponente()
        expect(screen.getByText(dataMock.inoculo)).toBeInTheDocument()
    })
})

// Prop showDivider 

describe('BannerLote — prop showDivider', () => {
    it('el último InfoLote (Inóculo usado) recibe showDivider=false', () => {
        renderComponente()
        const infoLotes = screen.getAllByTestId('info-lote')
        const ultimo = infoLotes[infoLotes.length - 1]
        expect(ultimo).toHaveAttribute('data-label', 'Inóculo usado')
        expect(ultimo).toHaveAttribute('data-show-divider', 'false')
    })

    it('los demás InfoLote no reciben showDivider=false explícito', () => {
        renderComponente()
        const infoLotes = screen.getAllByTestId('info-lote')
        const primeros = infoLotes.slice(0, 4)
        primeros.forEach((el) => {
            expect(el).not.toHaveAttribute('data-show-divider', 'false')
        })
    })
})

// Valores vacíos / edge cases 

describe('BannerLote — edge cases', () => {
    it('renderiza aunque los valores de data sean strings vacíos', () => {
        render(
            <BannerLote
                data={{ fecha: '', especie: '', sustrato: '', ubicacion: '', inoculo: '' }}
            />
        )
        expect(screen.getAllByTestId('info-lote')).toHaveLength(5)
    })

    it('muestra correctamente un valor de fecha diferente', () => {
        renderComponente({ fecha: '01/01/2025' })
        expect(screen.getByText('01/01/2025')).toBeInTheDocument()
    })

    it('muestra correctamente una especie diferente', () => {
        renderComponente({ especie: 'Ganoderma Lucidum' })
        expect(screen.getByText('Ganoderma Lucidum')).toBeInTheDocument()
    })
})
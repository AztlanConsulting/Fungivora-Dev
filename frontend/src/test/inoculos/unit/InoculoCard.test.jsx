import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import InoculoCard from '../../../features/inoculos/components/InoculoCard'

// Mock del hook para controlar el comportamiento desde afuera
vi.mock('../../../features/inoculos/hooks/useInoculoCard')
import useInoculoCard from '../../../features/inoculos/hooks/useInoculoCard'

// Mock de componentes UI compartidos
vi.mock('../../../shared/components/ui/basics/texto', () => ({
    default: ({ children }) => <p>{children}</p>,
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
    HugeiconsIcon: () => <span data-testid="icon" />,
}))
vi.mock('@hugeicons/core-free-icons', () => ({
    ArrowDown01Icon: {},
    ArrowUp01Icon: {},
}))

// Estado base del hook 

const hookBase = {
    tipoSeleccionado: 'agar',
    datos: [],
    loading: false,
    error: null,
    collapsed: false,
    handleTipoChange: vi.fn(),
    toggleCollapse: vi.fn(),
}

// Usamos abreviaciones por simplicidad
const especieMock = { value: 'PA', label: 'Pleurotus Abalonus' }

const datosMock = [
    {
        id_inoculo: 1,
        codigo_fungivora: 'PA-LE-2704',
        cantidad_disponible: '100.00',
        unidad: 'gramos',
        stock_recomendado: '50.00',
        fecha: '2026-04-27T06:00:00.000Z',
    },
    {
        id_inoculo: 2,
        codigo_fungivora: 'PA-LE-2903',
        cantidad_disponible: '200.00',
        unidad: 'gramos',
        stock_recomendado: '50.00',
        fecha: '2026-03-29T06:00:00.000Z',
    },
]

beforeEach(() => {
    vi.clearAllMocks()
    useInoculoCard.mockReturnValue(hookBase)
})

const renderComponente = (props = {}) =>
    render(<InoculoCard especie={especieMock} {...props} />)

// Renderizado base 

describe('InoculoCard — renderizado base', () => {
    it('muestra el nombre de la especie', () => {
        renderComponente()
        expect(screen.getByText('Pleurotus Abalonus')).toBeInTheDocument()
    })

    it('muestra el select de tipo cuando está expandido', () => {
        renderComponente()
        expect(screen.getByTestId('select-tipo')).toBeInTheDocument()
    })

    it('muestra los encabezados de la tabla', () => {
        renderComponente()
        expect(screen.getByText('Etiqueta')).toBeInTheDocument()
        expect(screen.getByText('Cantidad actual')).toBeInTheDocument()
        expect(screen.getByText('Stock mínimo')).toBeInTheDocument()
        expect(screen.getByText('Fecha Creación')).toBeInTheDocument()
    })

    it('muestra mensaje de sin registros cuando datos está vacío', () => {
        renderComponente()
        expect(screen.getByText('Sin registros para este tipo.')).toBeInTheDocument()
    })
})

// Estado colapsado 

describe('InoculoCard — estado colapsado', () => {
    beforeEach(() => {
        useInoculoCard.mockReturnValue({ ...hookBase, collapsed: true })
    })

    it('oculta la tabla cuando está colapsado', () => {
        renderComponente()
        expect(screen.queryByText('Etiqueta')).not.toBeInTheDocument()
    })

    it('oculta el select cuando está colapsado', () => {
        renderComponente()
        expect(screen.queryByTestId('select-tipo')).not.toBeInTheDocument()
    })

    it('sigue mostrando el nombre de la especie', () => {
        renderComponente()
        expect(screen.getByText('Pleurotus Abalonus')).toBeInTheDocument()
    })
})

// Estado de carga 

describe('InoculoCard — estado de carga', () => {
    it('muestra mensaje de cargando', () => {
        useInoculoCard.mockReturnValue({ ...hookBase, loading: true })
        renderComponente()
        expect(screen.getByText('Cargando...')).toBeInTheDocument()
    })

    it('no muestra la tabla mientras carga', () => {
        useInoculoCard.mockReturnValue({ ...hookBase, loading: true })
        renderComponente()
        expect(screen.queryByText('Etiqueta')).not.toBeInTheDocument()
    })
})

// Estado de error 

describe('InoculoCard — estado de error', () => {
    it('muestra el mensaje de error', () => {
        useInoculoCard.mockReturnValue({ ...hookBase, error: 'Error de red' })
        renderComponente()
        expect(screen.getByText('Error de red')).toBeInTheDocument()
    })

    it('no muestra la tabla cuando hay error', () => {
        useInoculoCard.mockReturnValue({ ...hookBase, error: 'Fallo' })
        renderComponente()
        expect(screen.queryByText('Etiqueta')).not.toBeInTheDocument()
    })
})

// Con datos 

describe('InoculoCard — con datos', () => {
    beforeEach(() => {
        useInoculoCard.mockReturnValue({ ...hookBase, datos: datosMock })
    })

    it('muestra las etiquetas de los inóculos', () => {
        renderComponente()
        expect(screen.getAllByText('PA-LE-2704').length).toBeGreaterThan(0)
        expect(screen.getAllByText('PA-LE-2903').length).toBeGreaterThan(0)
    })

    it('no muestra el mensaje de sin registros', () => {
        renderComponente()
        expect(screen.queryByText('Sin registros para este tipo.')).not.toBeInTheDocument()
    })
})

// Interacciones 

describe('InoculoCard — interacciones', () => {
    it('llama a toggleCollapse al hacer click en el nombre', async () => {
        const user = userEvent.setup()
        const toggleCollapse = vi.fn()
        useInoculoCard.mockReturnValue({ ...hookBase, toggleCollapse })

        renderComponente()
        await user.click(screen.getByText('Pleurotus Abalonus'))
        expect(toggleCollapse).toHaveBeenCalledTimes(1)
    })

    it('llama a handleTipoChange al cambiar el select', async () => {
        const user = userEvent.setup()
        const handleTipoChange = vi.fn()
        useInoculoCard.mockReturnValue({ ...hookBase, handleTipoChange })

        renderComponente()
        await user.selectOptions(screen.getByTestId('select-tipo'), 'Semilla')
        expect(handleTipoChange).toHaveBeenCalledTimes(1)
    })
})
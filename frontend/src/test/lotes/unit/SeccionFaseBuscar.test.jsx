import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SeccionFaseBuscar from '../../../features/lotes/components/SeccionFaseBuscar'

// Mock de Stepper
vi.mock('../../../shared/components/ui', () => ({
    Stepper: ({ steps, currentStep, onStepChange, colorTheme }) => (
        <div
            data-testid="stepper"
            data-current-step={currentStep}
            data-color-theme={colorTheme}
            data-steps={JSON.stringify(steps)}
        >
            {steps.map((step, index) => (
                <button
                    key={index}
                    data-testid={`step-${index}`}
                    onClick={() => onStepChange(index)}
                >
                    {step.label}
                </button>
            ))}
        </div>
    ),
    BarraBusqueda: ({ value, onChange, placeholder }) => (
        <input
            data-testid="barra-busqueda"
            value={value}
            onChange={onChange}
            placeholder={placeholder ?? 'Buscar...'}
        />
    ),
}))

// Datos de prueba 

const fasesMock = [
    { label: 'Inoculación' },
    { label: 'Colonización' },
    { label: 'Fructificación' },
]

const renderComponente = (props = {}) => {
    const defaults = {
        fases: fasesMock,
        fase: 0,
        setFase: vi.fn(),
        busqueda: '',
        setBusqueda: vi.fn(),
    }
    return render(<SeccionFaseBuscar {...defaults} {...props} />)
}

beforeEach(() => {
    vi.clearAllMocks()
})

// Renderizado base 

describe('SeccionFaseBuscar — renderizado base', () => {
    it('renderiza sin errores', () => {
        expect(() => renderComponente()).not.toThrow()
    })

    it('renderiza el Stepper', () => {
        renderComponente()
        expect(screen.getByTestId('stepper')).toBeInTheDocument()
    })

    it('renderiza la BarraBusqueda', () => {
        renderComponente()
        expect(screen.getByTestId('barra-busqueda')).toBeInTheDocument()
    })
})

// Props hacia Stepper 

describe('SeccionFaseBuscar — props hacia Stepper', () => {
    it('pasa las fases correctamente al Stepper', () => {
        renderComponente()
        const stepper = screen.getByTestId('stepper')
        expect(JSON.parse(stepper.dataset.steps)).toEqual(fasesMock)
    })

    it('pasa el paso actual correctamente al Stepper', () => {
        renderComponente({ fase: 2 })
        expect(screen.getByTestId('stepper')).toHaveAttribute('data-current-step', '2')
    })

    it('pasa colorTheme="azul" al Stepper', () => {
        renderComponente()
        expect(screen.getByTestId('stepper')).toHaveAttribute('data-color-theme', 'azul')
    })

    it('renderiza los labels de las fases dentro del Stepper', () => {
        renderComponente()
        expect(screen.getByText('Inoculación')).toBeInTheDocument()
        expect(screen.getByText('Colonización')).toBeInTheDocument()
        expect(screen.getByText('Fructificación')).toBeInTheDocument()
    })
})

// Props hacia BarraBusqueda 

describe('SeccionFaseBuscar — props hacia BarraBusqueda', () => {
    it('pasa el value de busqueda correctamente', () => {
        renderComponente({ busqueda: 'bloque 3' })
        expect(screen.getByTestId('barra-busqueda')).toHaveValue('bloque 3')
    })

    it('pasa busqueda vacía correctamente', () => {
        renderComponente({ busqueda: '' })
        expect(screen.getByTestId('barra-busqueda')).toHaveValue('')
    })
})

// Interacciones — Stepper 

describe('SeccionFaseBuscar — interacciones con Stepper', () => {
    it('llama a setFase con el índice correcto al hacer click en un paso', async () => {
        const user = userEvent.setup()
        const setFase = vi.fn()
        renderComponente({ setFase })

        await user.click(screen.getByTestId('step-1'))

        expect(setFase).toHaveBeenCalledWith(1)
        expect(setFase).toHaveBeenCalledTimes(1)
    })

    it('llama a setFase con índice 0 al hacer click en el primer paso', async () => {
        const user = userEvent.setup()
        const setFase = vi.fn()
        renderComponente({ setFase })

        await user.click(screen.getByTestId('step-0'))

        expect(setFase).toHaveBeenCalledWith(0)
    })

    it('llama a setFase con el último índice al hacer click en el último paso', async () => {
        const user = userEvent.setup()
        const setFase = vi.fn()
        renderComponente({ setFase })

        await user.click(screen.getByTestId(`step-${fasesMock.length - 1}`))

        expect(setFase).toHaveBeenCalledWith(fasesMock.length - 1)
    })
})

// Interacciones — BarraBusqueda 

describe('SeccionFaseBuscar — interacciones con BarraBusqueda', () => {
    it('llama a setBusqueda al escribir en la barra de búsqueda', async () => {
        const user = userEvent.setup()
        const setBusqueda = vi.fn()
        renderComponente({ setBusqueda })

        await user.type(screen.getByTestId('barra-busqueda'), 'A')

        expect(setBusqueda).toHaveBeenCalledTimes(1)
    })

    it('pasa el valor del evento a setBusqueda', async () => {
        const user = userEvent.setup()
        const setBusqueda = vi.fn()
        renderComponente({ setBusqueda })

        await user.type(screen.getByTestId('barra-busqueda'), 'X')

        // El onChange en el componente hace setBusqueda(e.target.value)
        expect(setBusqueda).toHaveBeenCalledWith('X')
    })
})

// Edge cases 

describe('SeccionFaseBuscar — edge cases', () => {
    it('renderiza con fases vacías sin romper', () => {
        expect(() => renderComponente({ fases: [] })).not.toThrow()
    })

    it('renderiza con fase fuera de rango sin romper', () => {
        expect(() => renderComponente({ fase: 99 })).not.toThrow()
    })

    it('renderiza correctamente con una sola fase', () => {
        renderComponente({ fases: [{ label: 'Inoculación' }], fase: 0 })
        expect(screen.getByText('Inoculación')).toBeInTheDocument()
    })
})
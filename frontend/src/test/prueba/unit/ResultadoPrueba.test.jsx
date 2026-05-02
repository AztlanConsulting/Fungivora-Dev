import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ResultadoPrueba from '../../../features/ejemplo/components/ResultadoPrueba'

// Mock de componentes UI para aislar de sus dependencias internas
vi.mock('../../../shared/components/ui', () => ({
    Titulo: ({ children }) => <h1>{children}</h1>,
    Text: ({ children }) => <p>{children}</p>,
    Botones: ({ children, onClick }) => (
        <button onClick={onClick}>{children}</button>
    ),
}))

// ─── Datos de prueba ──────────────────────────────────────────────────

const resultadoMock = {
    status: 'success',
    tiempo_respuesta: '42ms',
    datos_recuperados: 100,
}

// ─── Helper ───────────────────────────────────────────────────────────

const renderComponente = (props = {}) => {
    const defaults = {
        resultado: null,
        cargando: false,
        error: null,
        onEjecutar: vi.fn(),
        onLimpiar: vi.fn(),
    }
    return render(<ResultadoPrueba {...defaults} {...props} />)
}

// ─── Tests ────────────────────────────────────────────────────────────

describe('ResultadoPrueba — renderizado base', () => {
    it('muestra el título del componente', () => {
        renderComponente()
        expect(screen.getByText('Prueba')).toBeInTheDocument()
    })

    it('muestra el botón de ejecutar', () => {
        renderComponente()
        expect(screen.getByText('Ejecutar prueba')).toBeInTheDocument()
    })

    it('muestra el botón de limpiar', () => {
        renderComponente()
        expect(screen.getByText('Limpiar')).toBeInTheDocument()
    })

    it('no muestra resultado ni error en estado inicial', () => {
        renderComponente()
        expect(screen.queryByText('Status')).not.toBeInTheDocument()
        expect(screen.queryByText('success')).not.toBeInTheDocument()
    })
})

describe('ResultadoPrueba — estado de carga', () => {
    it('muestra mensaje de carga cuando cargando es true', () => {
        renderComponente({ cargando: true })
        expect(screen.getByText('Ejecutando prueba...')).toBeInTheDocument()
    })

    it('no muestra el resultado mientras carga', () => {
        renderComponente({ cargando: true, resultado: resultadoMock })
        expect(screen.queryByText('42ms')).not.toBeInTheDocument()
    })
})

describe('ResultadoPrueba — estado de error', () => {
    it('muestra el mensaje de error', () => {
        renderComponente({ error: 'Connection lost' })
        expect(screen.getByText('Error: Connection lost')).toBeInTheDocument()
    })

    it('no muestra el resultado cuando hay error', () => {
        renderComponente({ error: 'Fallo', resultado: resultadoMock })
        expect(screen.queryByText('42ms')).not.toBeInTheDocument()
    })
})

describe('ResultadoPrueba — estado de éxito', () => {
    it('muestra el status del resultado', () => {
        renderComponente({ resultado: resultadoMock })
        expect(screen.getByText('success')).toBeInTheDocument()
    })

    it('muestra el tiempo de respuesta', () => {
        renderComponente({ resultado: resultadoMock })
        expect(screen.getByText('42ms')).toBeInTheDocument()
    })

    it('muestra los registros recuperados', () => {
        renderComponente({ resultado: resultadoMock })
        expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('muestra las etiquetas de cada campo', () => {
        renderComponente({ resultado: resultadoMock })
        expect(screen.getByText('Status')).toBeInTheDocument()
        expect(screen.getByText('Tiempo de respuesta')).toBeInTheDocument()
        expect(screen.getByText('Registros recuperados')).toBeInTheDocument()
    })
})

describe('ResultadoPrueba — interacciones', () => {
    it('llama a onEjecutar al hacer click en ejecutar', async () => {
        const user = userEvent.setup()
        const onEjecutar = vi.fn()
        renderComponente({ onEjecutar })
        await user.click(screen.getByText('Ejecutar prueba'))
        expect(onEjecutar).toHaveBeenCalledTimes(1)
    })

    it('llama a onLimpiar al hacer click en limpiar', async () => {
        const user = userEvent.setup()
        const onLimpiar = vi.fn()
        renderComponente({ onLimpiar })
        await user.click(screen.getByText('Limpiar'))
        expect(onLimpiar).toHaveBeenCalledTimes(1)
    })
})
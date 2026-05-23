import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ResultadoPrueba from '../../../features/ejemplo/components/ResultadoPrueba'

// Mock de ui
vi.mock('../../../shared/components/ui', () => ({
    Titulo: ({ children }) => <h1>{children}</h1>,
    Text: ({ children }) => <p>{children}</p>,
    Botones: ({ children, onClick }) => (
        <button onClick={onClick}>{children}</button>
    ),
}))

const resultadoMock = {
    status: 'success',
    tiempo_respuesta: '42ms',
    datos_recuperados: 100,
}

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

describe('ResultadoPrueba — renderizado', () => {
    it('Titulo', () => {
        renderComponente()
        expect(screen.getByText('Prueba')).toBeInTheDocument()
    })

    it('Boton (ejecutar)', () => {
        renderComponente()
        expect(screen.getByText('Ejecutar prueba')).toBeInTheDocument()
    })

    it('Boton (limpiar)', () => {
        renderComponente()
        expect(screen.getByText('Limpiar')).toBeInTheDocument()
    })

    it('Sin errores iniciales', () => {
        renderComponente()
        expect(screen.queryByText('Status')).not.toBeInTheDocument()
        expect(screen.queryByText('success')).not.toBeInTheDocument()
    })
})

describe('ResultadoPrueba — carga', () => {
    it('Cargando en true', () => {
        renderComponente({ cargando: true })
        expect(screen.getByText('Ejecutando prueba...')).toBeInTheDocument()
    })

    it('Cargado en false', () => {
        renderComponente({ cargando: true, resultado: resultadoMock })
        expect(screen.queryByText('42ms')).not.toBeInTheDocument()
    })
})

describe('ResultadoPrueba —  error', () => {
    it('Mensaje de error', () => {
        renderComponente({ error: 'Connection lost' })
        expect(screen.getByText('Error: Connection lost')).toBeInTheDocument()
    })

    it('No muestra mensaje', () => {
        renderComponente({ error: 'Fallo', resultado: resultadoMock })
        expect(screen.queryByText('42ms')).not.toBeInTheDocument()
    })
})

describe('ResultadoPrueba —  éxito', () => {
    it('Status de éxito', () => {
        renderComponente({ resultado: resultadoMock })
        expect(screen.getByText('success')).toBeInTheDocument()
    })

    it('Tiempo de respuesta', () => {
        renderComponente({ resultado: resultadoMock })
        expect(screen.getByText('42ms')).toBeInTheDocument()
    })

    it('Registros recuperados', () => {
        renderComponente({ resultado: resultadoMock })
        expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('Etiquetas de cada campo', () => {
        renderComponente({ resultado: resultadoMock })
        expect(screen.getByText('Status')).toBeInTheDocument()
        expect(screen.getByText('Tiempo de respuesta')).toBeInTheDocument()
        expect(screen.getByText('Registros recuperados')).toBeInTheDocument()
    })
})

describe('ResultadoPrueba — interacciones', () => {
    it('onEjecutar al hacer click en ejecutar', async () => {
        const user = userEvent.setup()
        const onEjecutar = vi.fn()
        renderComponente({ onEjecutar })
        await user.click(screen.getByText('Ejecutar prueba'))
        expect(onEjecutar).toHaveBeenCalledTimes(1)
    })

    it('onLimpiar al hacer click en limpiar', async () => {
        const user = userEvent.setup()
        const onLimpiar = vi.fn()
        renderComponente({ onLimpiar })
        await user.click(screen.getByText('Limpiar'))
        expect(onLimpiar).toHaveBeenCalledTimes(1)
    })
})
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TablaBloques from '../../../features/lotes/components/TablaBloquesLote'

// Mock de Text
vi.mock('../../../shared/components/ui/basics/Texto', () => ({
    default: ({ children, variante, style }) => (
        <p data-testid="text" data-variante={variante} style={style}>
            {children}
        </p>
    ),
}))

// Mock de HugeiconsIcon
vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: ({ size, color, strokeWidth }) => (
        <span data-testid="icon" data-size={size} data-color={color} data-stroke={strokeWidth} />
    ),
}))

// Mock de íconos
vi.mock('@hugeicons/core-free-icons', () => ({
    Tick02Icon: {},
    ArrowDown01Icon: {},
}))

// Mock de colores
vi.mock('../../../shared/components/ui/basics/Colores', () => ({
    colores: {
        blanco: '#fff',
        azul: '#3b3fb6',
        gris: '#555555',
    },
}))

const CODIGO_LOTE = 'LT-001'

const bloquesMock = [
    { id_bloque: 1, peso_gr: '850.5', contenedor: 'Bolsa', produccion: 1, contaminado: 0, codigo_inoculo_bloque: 'LT-001' },
    { id_bloque: 2, peso_gr: '920.0', contenedor: 'Frasco', produccion: 0, contaminado: 1, codigo_inoculo_bloque: 'LT-001' },
    { id_bloque: 3, peso_gr: '0', contenedor: 'Bolsa', produccion: true, contaminado: false, codigo_inoculo_bloque: 'LT-001' },
]

const renderComponente = (props = {}) => {
    const defaults = {
        bloques: bloquesMock,
        loading: false,
        onToggleContaminado: vi.fn(),
        codigo_lote: CODIGO_LOTE,
    }
    return render(<TablaBloques {...defaults} {...props} />)
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe('TablaBloques — renderizado base', () => {
    it('renderiza sin errores', () => {
        expect(() => renderComponente()).not.toThrow()
    })

    it('muestra el encabezado "Código Bloque"', () => {
        renderComponente()
        expect(screen.getAllByText('Código Bloque').length).toBeGreaterThan(0)
    })

    it('muestra el encabezado "Tamaño"', () => {
        renderComponente()
        expect(screen.getAllByText('Tamaño').length).toBeGreaterThan(0)
    })

    it('muestra el encabezado "Peso"', () => {
        renderComponente()
        expect(screen.getAllByText('Peso').length).toBeGreaterThan(0)
    })

    it('muestra el encabezado "Clasificación"', () => {
        renderComponente()
        expect(screen.getAllByText('Clasificación').length).toBeGreaterThan(0)
    })

    it('muestra el encabezado "Contaminado"', () => {
        renderComponente()
        expect(screen.getAllByText('Contaminado').length).toBeGreaterThan(0)
    })
})

describe('TablaBloques — estado de carga', () => {
    it('muestra "Cargando bloques..." cuando loading=true', () => {
        renderComponente({ loading: true })
        expect(screen.getByText('Cargando bloques...')).toBeInTheDocument()
    })

    it('no muestra filas de bloques mientras carga', () => {
        renderComponente({ loading: true })
        expect(screen.queryByText(/BC/)).not.toBeInTheDocument()
    })

    it('no muestra el mensaje de vacío mientras carga', () => {
        renderComponente({ loading: true, bloques: [] })
        expect(screen.queryByText('Sin bloques registrados.')).not.toBeInTheDocument()
    })
})

describe('TablaBloques — estado vacío', () => {
    it('muestra mensaje de sin bloques cuando el array está vacío', () => {
        renderComponente({ bloques: [] })
        expect(screen.getByText('Sin bloques registrados.')).toBeInTheDocument()
    })

    it('no muestra filas cuando bloques está vacío', () => {
        renderComponente({ bloques: [] })
        expect(screen.queryByText(/BC/)).not.toBeInTheDocument()
    })
})

describe('TablaBloques — código visual', () => {
    it('genera el código visual correcto para cada bloque', () => {
        renderComponente()
        expect(screen.getAllByText('BC-LT-001-1').length).toBeGreaterThan(0)
        expect(screen.getAllByText('BC-LT-001-2').length).toBeGreaterThan(0)
        expect(screen.getAllByText('BC-LT-001-3').length).toBeGreaterThan(0)
    })
})

describe('TablaBloques — contenedor y peso', () => {
    it('muestra el contenedor de cada bloque', () => {
        renderComponente()
        expect(screen.getAllByText('Bolsa').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Frasco').length).toBeGreaterThan(0)
    })

    it('muestra el peso redondeado con la unidad correcta', () => {
        renderComponente()
        expect(screen.getAllByText('851 Gramos(s)').length).toBeGreaterThan(0)
        expect(screen.getAllByText('920 Gramos(s)').length).toBeGreaterThan(0)
        expect(screen.getAllByText('0 Gramos(s)').length).toBeGreaterThan(0)
    })

    it('muestra "0 Gramos(s)" cuando peso_gr es falsy', () => {
        renderComponente({
            bloques: [{ id_bloque: 1, peso_gr: null, contenedor: 'Bolsa', produccion: 1, contaminado: 0 }],
        })
        expect(screen.getAllByText('0 Gramos(s)').length).toBeGreaterThan(0)
    })
})

describe('TablaBloques — clasificación', () => {
    it('muestra "Producción" cuando produccion=1', () => {
        renderComponente()
        expect(screen.getAllByText('Producción').length).toBeGreaterThan(0)
    })

    it('muestra "Experimental" cuando produccion=0', () => {
        renderComponente()
        expect(screen.getAllByText('Experimental').length).toBeGreaterThan(0)
    })
})

describe('TablaBloques — checkbox contaminado', () => {
    it('renderiza un checkbox por bloque', () => {
        renderComponente()
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes.length).toBe(bloquesMock.length * 2)
    })

    it('el checkbox está marcado cuando contaminado=1', async () => {
        renderComponente({
            bloques: [{ id_bloque: 2, peso_gr: '100', contenedor: 'Bolsa', produccion: 0, contaminado: 1 }],
        })
        const checkboxes = screen.getAllByRole('checkbox')
        checkboxes.forEach((cb) => expect(cb).toBeChecked())
    })
})

describe('TablaBloques — interacciones', () => {
    it('llama a onToggleContaminado con el id_bloque al hacer click', async () => {
        const user = userEvent.setup()
        const onToggleContaminado = vi.fn()
        renderComponente({
            bloques: [{ id_bloque: 7, peso_gr: '100', contenedor: 'Bolsa', produccion: 1, contaminado: 0 }],
            onToggleContaminado,
        })

        const checkboxes = screen.getAllByRole('checkbox')
        await user.click(checkboxes[0])

        expect(onToggleContaminado).toHaveBeenCalledWith(7)
    })
})
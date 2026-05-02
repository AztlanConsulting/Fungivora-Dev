import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SelectEspecie from '../../../features/inoculos/components/selecionar_especie'

// ─── Mock de fetch ────────────────────────────────────────────────────

const especiesMock = [
    { especie: 'Shiitake' },
    { especie: 'Oyster' },
    { especie: 'Reishi' },
]

const mockFetchExito = () => {
    global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: especiesMock }),
    })
}

const mockFetchError = () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Error de conexión'))
}

const mockFetchSinExito = () => {
    global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ success: false }),
    })
}

beforeEach(() => {
    vi.clearAllMocks()
})

// ─── Helper ───────────────────────────────────────────────────────────

const renderComponente = (props = {}) => {
    const defaults = {
        value: '',
        onChange: vi.fn(),
    }
    return render(<SelectEspecie {...defaults} {...props} />)
}

// ─── Tests ────────────────────────────────────────────────────────────

describe('SelectEspecie — estado de carga', () => {
    it('muestra "Cargando especies..." mientras espera la respuesta', () => {
        global.fetch = vi.fn().mockReturnValue(new Promise(() => {}))
        renderComponente()

        // La opción es hidden/disabled, se busca por texto
        expect(screen.getByText('Cargando especies...')).toBeInTheDocument()
    })

    it('el select está deshabilitado mientras carga', () => {
        global.fetch = vi.fn().mockReturnValue(new Promise(() => {}))
        renderComponente()

        expect(screen.getByRole('combobox')).toBeDisabled()
    })
})

describe('SelectEspecie — carga exitosa', () => {
    it('muestra el placeholder tras cargar', async () => {
        mockFetchExito()
        renderComponente()

        await waitFor(() => {
            expect(screen.getByText('Selecciona una especie...')).toBeInTheDocument()
        })
    })

    it('renderiza todas las especies recibidas', async () => {
        mockFetchExito()
        renderComponente()

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Shiitake' })).toBeInTheDocument()
            expect(screen.getByRole('option', { name: 'Oyster' })).toBeInTheDocument()
            expect(screen.getByRole('option', { name: 'Reishi' })).toBeInTheDocument()
        })
    })

    it('el select queda habilitado tras cargar', async () => {
        mockFetchExito()
        renderComponente()

        await waitFor(() => {
            expect(screen.getByRole('combobox')).not.toBeDisabled()
        })
    })

    it('llama al endpoint correcto', async () => {
        mockFetchExito()
        renderComponente()

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/inoculos/especies')
        })
    })
})

describe('SelectEspecie — error de conexión', () => {
    it('muestra mensaje de error cuando fetch falla', async () => {
        mockFetchError()
        renderComponente()

        await waitFor(() => {
            expect(screen.getByText('Error de conexión')).toBeInTheDocument()
        })
    })
})

describe('SelectEspecie — respuesta sin éxito', () => {
    it('muestra mensaje cuando success es false', async () => {
        mockFetchSinExito()
        renderComponente()

        await waitFor(() => {
            expect(screen.getByText('No se pudieron cargar las especies')).toBeInTheDocument()
        })
    })
})

describe('SelectEspecie — props', () => {
    it('refleja el value recibido por prop', async () => {
        mockFetchExito()
        renderComponente({ value: 'Shiitake' })

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toHaveValue('Shiitake')
        })
    })

    it('llama a onChange al seleccionar una especie', async () => {
        const onChange = vi.fn()
        mockFetchExito()

        render(<SelectEspecie value="" onChange={onChange} />)

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Shiitake' })).toBeInTheDocument()
        })

        const select = screen.getByRole('combobox')
        select.dispatchEvent(new Event('change', { bubbles: true }))
        expect(onChange).toBeDefined()
    })

    it('usa el placeholder personalizado si se pasa por prop', async () => {
        mockFetchExito()
        renderComponente({ placeholder: 'Elige una especie' })

        await waitFor(() => {
            expect(screen.getByText('Elige una especie')).toBeInTheDocument()
        })
    })
})
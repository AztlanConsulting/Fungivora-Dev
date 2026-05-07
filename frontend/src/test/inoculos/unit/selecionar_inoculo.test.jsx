import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SelectInoculo from '../../../features/inoculos/components/selecionar_inoculo'

// ─── Mock del hook ────────────────────────────────────────────────────────────

vi.mock('../../../features/inoculos/hooks/useInoculoprarasemillas')
import useInoculoParaSemilla from '../../../features/inoculos/hooks/useInoculoprarasemillas'

const opcionesMock = [
    {
        value: 1,
        label: 'AG-001 — Agar (500 ml)',
        stockBajo: false,
        raw: { id_inoculo: 1, codigo_fungivora: 'AG-001', especie: 'Shiitake', tipo: 'Agar', cantidad_disponible: 500, unidad: 'ml' },
    },
    {
        value: 2,
        label: 'ML-001 — Medio Líquido (100 ml)',
        stockBajo: true,
        raw: { id_inoculo: 2, codigo_fungivora: 'ML-001', especie: 'Shiitake', tipo: 'Medio Líquido', cantidad_disponible: 100, unidad: 'ml' },
    },
]

const hookBase = { opciones: [], loading: false, error: null }

// ─── Helper ───────────────────────────────────────────────────────────────────

const renderComponente = (props = {}) => {
    const defaults = {
        especie: '',
        value: '',
        onChange: vi.fn(),
        onRawChange: vi.fn(),
    }
    return render(<SelectInoculo {...defaults} {...props} />)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    vi.clearAllMocks()
    useInoculoParaSemilla.mockReturnValue(hookBase)
})

describe('SelectInoculo — sin especie seleccionada', () => {

    it('muestra placeholder indicando que se seleccione una especie primero', () => {
        renderComponente({ especie: '' })

        expect(screen.getByText('Selecciona una especie primero')).toBeInTheDocument()
    })

    it('el select está deshabilitado cuando no hay especie', () => {
        renderComponente({ especie: '' })

        expect(screen.getByRole('combobox')).toBeDisabled()
    })
})

describe('SelectInoculo — estado de carga', () => {

    it('el select está deshabilitado mientras carga', () => {
        useInoculoParaSemilla.mockReturnValue({ ...hookBase, loading: true })
        renderComponente({ especie: 'Shiitake' })

        expect(screen.getByRole('combobox')).toBeDisabled()
    })
})

describe('SelectInoculo — sin inóculos disponibles', () => {

    it('muestra placeholder indicando que no hay inóculos para la especie', () => {
        useInoculoParaSemilla.mockReturnValue({ ...hookBase, opciones: [] })
        renderComponente({ especie: 'Shiitake' })

        expect(screen.getByText('Sin inóculos disponibles para esta especie')).toBeInTheDocument()
    })

    it('el select está deshabilitado cuando no hay opciones', () => {
        useInoculoParaSemilla.mockReturnValue({ ...hookBase, opciones: [] })
        renderComponente({ especie: 'Shiitake' })

        expect(screen.getByRole('combobox')).toBeDisabled()
    })
})

describe('SelectInoculo — con inóculos disponibles', () => {

    it('renderiza todas las opciones recibidas', async () => {
        useInoculoParaSemilla.mockReturnValue({ ...hookBase, opciones: opcionesMock })
        renderComponente({ especie: 'Shiitake' })

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'AG-001 — Agar (500 ml)' })).toBeInTheDocument()
            expect(screen.getByRole('option', { name: 'ML-001 — Medio Líquido (100 ml)' })).toBeInTheDocument()
        })
    })

    it('el select está habilitado cuando hay opciones', () => {
        useInoculoParaSemilla.mockReturnValue({ ...hookBase, opciones: opcionesMock })
        renderComponente({ especie: 'Shiitake' })

        expect(screen.getByRole('combobox')).not.toBeDisabled()
    })

    it('muestra el placeholder correcto cuando hay opciones', () => {
        useInoculoParaSemilla.mockReturnValue({ ...hookBase, opciones: opcionesMock })
        renderComponente({ especie: 'Shiitake' })

        expect(screen.getByText('Selecciona inóculo')).toBeInTheDocument()
    })

    it('refleja el value recibido por prop', () => {
        useInoculoParaSemilla.mockReturnValue({ ...hookBase, opciones: opcionesMock })
        renderComponente({ especie: 'Shiitake', value: 1 })

        expect(screen.getByRole('combobox')).toHaveValue('1')
    })
})

describe('SelectInoculo — callbacks', () => {

    it('llama a onChange al seleccionar una opción', async () => {
        const onChange = vi.fn()
        useInoculoParaSemilla.mockReturnValue({ ...hookBase, opciones: opcionesMock })
        renderComponente({ especie: 'Shiitake', onChange })

        const select = screen.getByRole('combobox')
        select.dispatchEvent(new Event('change', { bubbles: true }))

        expect(onChange).toBeDefined()
    })

    it('llama a onRawChange con el objeto completo al seleccionar', async () => {
        const user = userEvent.setup()
        const onRawChange = vi.fn()
        const onChange = vi.fn()

        useInoculoParaSemilla.mockReturnValue({ ...hookBase, opciones: opcionesMock })
        renderComponente({ especie: 'Shiitake', onChange, onRawChange })

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'AG-001 — Agar (500 ml)' })).toBeInTheDocument()
        })

        await user.selectOptions(screen.getByRole('combobox'), '1')

        expect(onRawChange).toHaveBeenCalledWith(opcionesMock[0].raw)
    })
})
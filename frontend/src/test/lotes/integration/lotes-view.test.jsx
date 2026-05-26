import React from 'react'
import { render, screen} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Lotes } from '../../../pages'
import useLotes from "../../../features/lotes/hooks/useLotes";

vi.mock("../../../features/lotes/hooks/useLotes", () => ({
    default: vi.fn()
}));

// Mocks de UI 
vi.mock('../../shared/components/ui/basics/Titulo', () => ({ default: ({ children }) => <h1>{children}</h1> }))
vi.mock('../../shared/components/ui/basics/Texto', () => ({ default: ({ children, className, style }) => <span className={className} style={style}>{children}</span> }))
vi.mock('../../shared/components/layout/Base', () => ({ default: ({ children }) => <div>{children}</div> }))
vi.mock('../../shared/components/ui/buttons/Botones', () => ({
    default: ({ children, onClick, className }) => <button className={className} onClick={onClick}>{children}</button>
}))
vi.mock('../../shared/components/ui/inputs/InputFecha', () => ({ default: () => <input data-testid="input-fecha" /> }))

vi.mock('../../shared/components/ui/inputs/SeleccionarTexto', () => ({
    default: ({ placeholder, onChange, options, value }) => (
        <select
            data-testid={`select-${placeholder.replace(/\s+/g, '-').toLowerCase()}`}
            value={value || ""}
            onChange={(e) => onChange({ value: e.target.value, label: e.target.value })}
        >
            <option value="">{placeholder}</option>
            {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    )
}));

const renderWithRouter = (component) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    )
}

const mockDatos = [
    { id_lote: 1, codigo_fungivora: "LOTE-001", tipo_sustrato: "Paja", ubicacion_lote: "Estante A", fase: "Cosecha", fecha_lote: "2024-01-01" },
    { id_lote: 2, codigo_fungivora: "LOTE-002", tipo_sustrato: "Aserrín", ubicacion_lote: "Estante B", fase: "Inoculación", fecha_lote: "2024-01-05" }
];

describe('Vista Lotes', () => {
    const addLoteMock = vi.fn();
    const refreshMock = vi.fn();
    const getInoculosPorEspecieMock = vi.fn(() => [{
        value: 'INO-001',
        label: 'Inóculo 1',
        abreviatura: 'PL'
    }]);

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();

        vi.mocked(useLotes).mockReturnValue({
            datos: mockDatos,
            especiesDisponibles: [{ value: 'Pleurotus', label: 'Pleurotus' }], 
            sustratos: [{ value: 'Paja', label: 'Paja' }],
            ubicaciones: [{ value: 'Estante A', label: 'Estante A' }],
            getInoculosPorEspecie: getInoculosPorEspecieMock,
            cargando: false,
            error: null,
            addLote: addLoteMock,
            refresh: refreshMock
        });
    })

    it('Carga y muestra los lotes correctamente en la tabla', async () => {
        renderWithRouter(<Lotes />);

        expect(screen.getAllByText("Lotes").length).toBeGreaterThan(0);
        expect(screen.getAllByText(/LOTE-001/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/LOTE-002/i).length).toBeGreaterThan(0);
    });

    it('Muestra error de validación si faltan campos', async () => {
        const user = userEvent.setup();
        renderWithRouter(<Lotes />);

        const botonesCrear = screen.getAllByRole('button', { name: /Siguiente/i });
        const botonFormulario = botonesCrear[botonesCrear.length - 1];

        await user.click(botonFormulario);

        expect(screen.getByText(/Por favor, completa los datos del lote/i)).toBeInTheDocument();
        expect(addLoteMock).not.toHaveBeenCalled();
    });

    it('Muestra estado de carga si no hay datos', () => {
        vi.mocked(useLotes).mockReturnValue({
            datos: [],
            sustratos: [],
            ubicaciones: [],
            especiesDisponibles: [],
            cargando: true,
            error: null,
            addLote: vi.fn(),
            refresh: vi.fn(),
            getInoculosPorEspecie: vi.fn()
        });

        renderWithRouter(<Lotes />);
        expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
    });

    it('Vista de tabla y formulario', async () => {
        const user = userEvent.setup();
        renderWithRouter(<Lotes />);

        const toggles = screen.getAllByText(/Crear lote/i);
        const botonToggle = toggles[0].closest('button') || toggles[0].closest('div');

        await user.click(botonToggle);

        const titulos = screen.getAllByText(/Crear Lote/i);
        expect(titulos.length).toBeGreaterThan(0);
    });

    it('Mensaje de error falla al cargar datos', () => {
        vi.mocked(useLotes).mockReturnValue({
            datos: [],
            sustratos: [],
            ubicaciones: [],
            especiesDisponibles: [],
            error: true,
            cargando: false,
            addLote: vi.fn(),
            refresh: vi.fn(),
            getInoculosPorEspecie: vi.fn()
        });

        renderWithRouter(<Lotes />);
        expect(screen.getByText(/Error al cargar los datos/i)).toBeInTheDocument();
    });
});
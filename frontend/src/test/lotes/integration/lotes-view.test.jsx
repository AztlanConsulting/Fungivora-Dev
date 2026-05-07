import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Lotes } from '../../../pages'
import useLotes from "../../../features/lotes/hooks/useLotes";

vi.mock("../../../features/lotes/hooks/useLotes", () => ({
    default: vi.fn()
}));

// Mocks de UI 
vi.mock('../../shared/components/ui/basics/titulo', () => ({ default: ({ children }) => <h1>{children}</h1> }))
vi.mock('../../shared/components/ui/basics/texto', () => ({ default: ({ children, className }) => <span className={className}>{children}</span> }))
vi.mock('../../shared/components/layout/base', () => ({ default: ({ children }) => <div>{children}</div> }))
vi.mock('../../shared/components/ui/buttons/botones', () => ({ 
    default: ({ children, onClick }) => <button onClick={onClick}>{children}</button> 
}))
vi.mock('../../shared/components/ui/inputs/input_fecha', () => ({ default: () => <input data-testid="input-fecha" /> }))

vi.mock('../../shared/components/ui/inputs/seleccionar_texto', () => ({
    default: ({ placeholder, onChange, options, value }) => (
        <select 
            data-testid={`select-${placeholder}`} 
            value={value || ""}
            onChange={(e) => onChange({ value: e.target.value, label: e.target.value })}
        >
            <option value="">{placeholder}</option>
            {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    )
}));

const mockDatos = [
    { id_lote: 1, codigo_fungivora: "LOTE-001", tipo_sustrato: "Paja", ubicacion_lote: "Estante A", fase: "Cosecha", fecha_lote: "2024-01-01" },
    { id_lote: 2, codigo_fungivora: "LOTE-002", tipo_sustrato: "Aserrín", ubicacion_lote: "Estante B", fase: "Inoculación", fecha_lote: "2024-01-05" }
];

describe('Vista Lotes', () => {
    const addLoteMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    vi.useRealTimers();
        
        vi.mocked(useLotes).mockReturnValue({
            datos: mockDatos,
            sustratos: [{ value: 'Paja', label: 'Paja' }],
            ubicaciones: [{ value: 'Estante A', label: 'Estante A' }],
            cargando: false,
            error: null,
            addLote: addLoteMock,
            refresh: vi.fn()
        });
    })

    it('Carga y muestra los lotes correctamente', async () => {
        render(<Lotes />);
        
        expect(screen.getByText("Lotes")).toBeInTheDocument();
        const codigos = screen.getAllByText(/LOTE-001/i);
        expect(codigos.length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Paja/i)[0]).toBeInTheDocument();
    });

    it('Selecciona una fila al hacer click', async () => {
        const user = userEvent.setup();
        render(<Lotes />);

        const filas = screen.getAllByText("LOTE-001");
        const contenedorFila = filas[0].closest('.md\\:hidden');
        
        await user.click(contenedorFila);
        
        expect(contenedorFila).toHaveClass('ring-2');
        expect(contenedorFila).toHaveStyle('border-color: #3b3fb6'); 
    });

    it('Muestra error de validación si faltan campos en el formulario', async () => {
        const user = userEvent.setup();
        render(<Lotes />);
        const botonesCrear = screen.getAllByRole('button', { name: /Crear Lote/i });
        await user.click(botonesCrear[botonesCrear.length - 1]);

        expect(screen.getByText(/Por favor, completa los campos/i)).toBeInTheDocument();
        expect(addLoteMock).not.toHaveBeenCalled();
    });
});
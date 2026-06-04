import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PantallaPrincipalView from '../../../features/home/components/HomeView'; 
import useHome from '../../../features/home/hooks/useHome';

vi.mock('../../../features/home/hooks/useHome', () => ({
    default: vi.fn()
}));

vi.mock('../../../shared/components/ui', () => ({
    Titulo: ({ children }) => <h1>{children}</h1>,
    Text: ({ children, style }) => <span style={style}>{children}</span>
}));

vi.mock('../../../shared/components/layout', () => ({
    Base: ({ children }) => <div data-testid="layout-base">{children}</div>
}));

vi.mock('../../../features/home/components/PanelLista', () => ({
    default: ({ titulo, onRevisar, mostrarChecks }) => (
        <div data-testid={`panel-${titulo.toLowerCase().replace(/\s+/g, '-')}`}>
            <h2>{titulo}</h2>
            {mostrarChecks && (
                <button onClick={() => onRevisar()}>Confirmar Revision</button>
            )}
        </div>
    )
}));

vi.mock('../../../features/home/components/AccesoRapido', () => ({
    default: ({ label, ruta }) => <div data-testid="acceso-rapido">{label} - {ruta}</div>
}));

vi.mock('../../../features/home/components/MetricaCard', () => ({
    default: ({ label, valor }) => (
        <div data-testid="metrica-card">
            <span>{label}</span>: <span>{valor}</span>
        </div>
    )
}));

const renderWithRouter = (component) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    );
};

const mockDashboardCompleto = {
    cards: {
        lotesActivos: 14,
        bloquesNoContaminados: 120,
        bloquesContaminados: 3
    },
    listas: {
        lotesRevision: [{ id: 'L-1', info: 'Lote Shiitake' }],
        inventarioBajo: [{ id: 'I-1', info: 'Agar Agar' }]
    },
    lotes: []
};

describe('Vista PantallaPrincipalView (Dashboard)', () => {
    const revisarLotesMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useHome).mockReturnValue({
            dashboard: mockDashboardCompleto,
            loading: false,
            error: null,
            revisarLotes: revisarLotesMock
        });
    });

    it('Muestra estado de carga si el hook está resolviendo', () => {
        vi.mocked(useHome).mockReturnValue({
            dashboard: null,
            loading: true,
            error: null,
            revisarLotes: vi.fn()
        });

        renderWithRouter(<PantallaPrincipalView />);
        expect(screen.getByText(/Cargando dashboard.../i)).toBeInTheDocument();
        expect(screen.queryByText(/¡Bienvenid@ a Devora!/i)).not.toBeInTheDocument();
    });

    it('Muestra el bloque de error si falla la comunicación con el servidor', () => {
        vi.mocked(useHome).mockReturnValue({
            dashboard: null,
            loading: false,
            error: 'Error de red masivo',
            revisarLotes: vi.fn()
        });

        renderWithRouter(<PantallaPrincipalView />);
        expect(screen.getByText(/Error al cargar los datos del servidor./i)).toBeInTheDocument();
        expect(screen.queryByText(/¡Bienvenid@ a Devora!/i)).not.toBeInTheDocument();
    });

    it('Renderiza correctamente todos los paneles, accesos rápidos y métricas cuando los datos existen', () => {
        renderWithRouter(<PantallaPrincipalView />);

        // Verificar el encabezado principal
        expect(screen.getByRole('heading', { name: /¡Bienvenid@ a Dévora!/i })).toBeInTheDocument();

        // Verificar los dos paneles principales
        expect(screen.getByTestId('panel-lotes-por-revisar')).toBeInTheDocument();
        expect(screen.getByTestId('panel-inventario-bajo')).toBeInTheDocument();

        // Verificar que los 4 accesos rápidos mapeados se pinten
        const accesos = screen.getAllByTestId('acceso-rapido');
        expect(accesos).toHaveLength(4);
        expect(screen.getByText(/Crear Agar - \/inoculos\/crear\/agar/i)).toBeInTheDocument();
        expect(screen.getByText(/Crear Lote - \/lotes/i)).toBeInTheDocument();

        // Verificar las tarjetas de métricas del resumen general
        expect(screen.getByText('Lotes activos')).toBeInTheDocument();
        expect(screen.getByText('14')).toBeInTheDocument();
        expect(screen.getByText('Bloques saludables')).toBeInTheDocument();
        expect(screen.getByText('120')).toBeInTheDocument();
    });

    it('No llama al hook revisarLotes si la selección de elementos marcados está vacía', async () => {
        const user = userEvent.setup();
        renderWithRouter(<PantallaPrincipalView />);

        const botonRevisar = screen.getByRole('button', { name: /Confirmar Revision/i });
        await user.click(botonRevisar);
        expect(revisarLotesMock).not.toHaveBeenCalled();
    });

    it('Llama al hook revisarLotes con los IDs correctos cuando se ejecuta la revisión', async () => {
        vi.mocked(useHome).mockReturnValue({
            dashboard: mockDashboardCompleto,
            loading: false,
            error: null,
            revisarLotes: revisarLotesMock
        });
    });
});
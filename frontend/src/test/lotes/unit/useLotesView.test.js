import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useLotes from '../../../features/lotes/hooks/useLotes';
import loteService from '../../../features/lotes/services/lotes.service';

vi.mock('../../../features/lotes/services/lotes.service', () => ({
  default: {
    getLotes: vi.fn(),
    addLote: vi.fn()
  }
}));

// Mock de fetch global
global.fetch = vi.fn();

describe('useLotes Hook', () => {
  const mockData = {
    success: true,
    data: [
      { id_lote: 1, codigo_fungivora: 'LOTE-001', fecha_lote: '2024-01-01' },
      { id_lote: 2, codigo_fungivora: 'LOTE-002', fecha_lote: '2024-05-01' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockResolvedValue({
      json: () => Promise.resolve([{ opcion: 'Paja' }])
    });
  });

  it('Debe cargar los lotes al inicializar', async () => {
    vi.mocked(loteService.getLotes).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLotes());

    // Empieza cargando
    expect(result.current.cargando).toBe(true);

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.datos).toHaveLength(2);
    expect(result.current.datos[0].codigo_fungivora).toBe('LOTE-001');
  });

  it('Debe manejar errores del servicio correctamente', async () => {
    // Fallo en la respuesta del service
    vi.mocked(loteService.getLotes).mockResolvedValue({ success: false });

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false));
    
    expect(result.current.error).toBe("Error al cargar lotes");
  });

  it('Debe agregar un nuevo lote y refrescar la lista', async () => {
    const nuevoLote = { tipo_sustrato: "Paja", ubicacion_lote: "Granja" };
    vi.mocked(loteService.addLote).mockResolvedValue({ success: true });
    vi.mocked(loteService.getLotes).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false));

    let exito;
    await act(async () => {
      exito = await result.current.addLote(nuevoLote);
    });

    expect(exito).toBe(true);
    expect(loteService.addLote).toHaveBeenCalledWith(nuevoLote);
    expect(loteService.getLotes).toHaveBeenCalledTimes(2);
  });
});
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
  const mockLotesData = {
    success: true,
    data: [
      { id_lote: 1, codigo_fungivora: 'LOTE-001', fecha_lote: '2024-01-01' },
      { id_lote: 2, codigo_fungivora: 'LOTE-002', fecha_lote: '2024-05-01' }
    ]
  };

  const mockEspeciesData = {
    data: [
      { id_inoculo: 10, codigo_fungivora: 'INC-01', especie: 'Pleurotus' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock para las diferentes llamadas
    fetch.mockImplementation((url) => {
      if (url.includes('/api/lotes/sustratos')) {
        return Promise.resolve({ json: () => Promise.resolve([{ opcion: 'Paja' }]) });
      }
      if (url.includes('/api/lotes/ubicaciones')) {
        return Promise.resolve({ json: () => Promise.resolve([{ opcion: 'Estante A' }]) });
      }
      if (url.includes('/api/lotes/especies')) {
        return Promise.resolve({ json: () => Promise.resolve(mockEspeciesData) });
      }
      return Promise.reject(new Error("URL no mockeada"));
    });
  });

  it('Cargar lotes y catálogos', async () => {
    vi.mocked(loteService.getLotes).mockResolvedValue(mockLotesData);

    const { result } = renderHook(() => useLotes());

    expect(result.current.cargando).toBe(true);

    await waitFor(() => expect(result.current.cargando).toBe(false));

    // Verificar Lotes
    expect(result.current.datos).toHaveLength(2);
    expect(result.current.sustratos).toEqual([{ value: 'Paja', label: 'Paja' }]);
    expect(result.current.ubicaciones).toEqual([{ value: 'Estante A', label: 'Estante A' }]);
    expect(result.current.especies).toEqual([{ value: 10, label: 'INC-01 / Pleurotus' }]);
  });

  it('Manejar errores correctamente', async () => {
    vi.mocked(loteService.getLotes).mockResolvedValue({ success: false });

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false));
    
    expect(result.current.error).toBe("Error al cargar lotes");
  });

  it('Manejar errores de conexión', async () => {
    vi.mocked(loteService.getLotes).mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false));
    
    expect(result.current.error).toBe("Error de conexión");
  });

  it('Agregar un nuevo lote y refrescar la lista', async () => {
    const nuevoLote = { tipo_sustrato: "Paja", ubicacion_lote: "Estante A", id_inoculo: 10 };
    vi.mocked(loteService.addLote).mockResolvedValue({ success: true });
    vi.mocked(loteService.getLotes).mockResolvedValue(mockLotesData);

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

  it('Retornar false si creación del lote falla', async () => {
    vi.mocked(loteService.addLote).mockResolvedValue({ success: false });
    vi.mocked(loteService.getLotes).mockResolvedValue(mockLotesData);

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false));

    let exito;
    await act(async () => {
      exito = await result.current.addLote({ incompleto: true });
    });

    expect(exito).toBe(false);
    expect(loteService.getLotes).toHaveBeenCalledTimes(1);
  });
});
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useLotes from '../../../features/lotes/hooks/useLotes';
import loteService from '../../../features/lotes/services/lotes.service';

vi.mock('../../../features/lotes/services/lotes.service', () => ({
  default: {
    getLotes: vi.fn(),
    addLote: vi.fn(),
    getSustratos: vi.fn(),
    getUbicaciones: vi.fn(),
    getEspecies: vi.fn(),
  }
}));

describe('useLotes Hook', () => {
  const mockLotesData = {
    success: true,
    data: [
      { id_lote: 1, codigo_fungivora: 'LOTE-001', fecha_lote: '2024-01-01' },
    ]
  };

  const mockSustratosData = [{ opcion: 'Paja' }];
  const mockUbicacionesData = [{ opcion: 'Estante A' }];
  
  const mockEspeciesData = {
    success: true,
    data: [
      { id_inoculo: 10, codigo_fungivora: 'INC-01', especie: 'Pleurotus' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("token", "mock-token-valido-ejemplo");
    vi.mocked(loteService.getSustratos).mockResolvedValue(mockSustratosData);
    vi.mocked(loteService.getUbicaciones).mockResolvedValue(mockUbicacionesData);
    vi.mocked(loteService.getEspecies).mockResolvedValue(mockEspeciesData);
  });

  it('cargar correctamente los catálogos y lotes', async () => {
    vi.mocked(loteService.getLotes).mockResolvedValue(mockLotesData);

    const { result } = renderHook(() => useLotes());
    expect(result.current.cargando).toBe(true);

    await waitFor(() => expect(result.current.cargando).toBe(false));

    await waitFor(() => {
      expect(result.current.ubicaciones).toEqual([{ value: 'Estante A', label: 'Estante A' }]);
    });

    await waitFor(() => {
      expect(result.current.especiesDisponibles).toEqual([
        { value: 'Pleurotus', label: 'Pleurotus' }
      ]);
    });

    expect(result.current.datos).toHaveLength(1);
    expect(result.current.datos[0].codigo_fungivora).toBe('LOTE-001');
    expect(result.current.error).toBeNull();
  });

  it('error cuando el servicio devuelve success: false', async () => {
    vi.mocked(loteService.getLotes).mockResolvedValue({ success: false });

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.error).toBe("Error al cargar lotes");
    expect(result.current.datos).toEqual([]);
  });

  it('errores de excepción carga de lotes', async () => {
    vi.mocked(loteService.getLotes).mockRejectedValue(new Error("Error de red"));

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.error).toBe("Error de conexión con el servidor");
  });

  it('llamar al servicio, true y refrescar la lista', async () => {
    const nuevoLote = { tipo_sustrato: "Paja", ubicacion_lote: "Estante A", id_inoculo: 10 };

    vi.mocked(loteService.addLote).mockResolvedValue({ success: true });
    vi.mocked(loteService.getLotes).mockResolvedValue(mockLotesData);

    const { result } = renderHook(() => useLotes());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    let resultadoAccion;
    await act(async () => {
      resultadoAccion = await result.current.addLote(nuevoLote);
    });

    expect(resultadoAccion.success).toBe(true);
    expect(loteService.addLote).toHaveBeenCalledWith(nuevoLote);
    expect(loteService.getLotes).toHaveBeenCalledTimes(2);
  });

  it('retornar false si la API falla', async () => {
    vi.mocked(loteService.addLote).mockResolvedValue({ success: false });
    vi.mocked(loteService.getLotes).mockResolvedValue(mockLotesData);

    const { result } = renderHook(() => useLotes());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    let resultadoAccion;
    await act(async () => {
      resultadoAccion = await result.current.addLote({});
    });

    expect(resultadoAccion.success).toBe(false);
    expect(loteService.getLotes).toHaveBeenCalledTimes(1);
  });
});
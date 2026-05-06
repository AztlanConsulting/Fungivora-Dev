import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useLotes from '../../../features/lotes/hooks/useLotes';
import loteService from '../../../features/lotes/services/lotes.service';

// Mock del service (conexión con la ruta)
vi.mock('../../../features/lotes/services/lotes.service', () => ({
  default: {
    getLotes: vi.fn(),
    addLote: vi.fn()
  }
}));

describe('useLotes con hook', () => {
  const mockData = {
    success: true,
    data: [
      { id_lote: 1, codigo_fungivora: 'LOTE-OLD', fecha_lote: '2024-01-01T10:00:00Z' },
      { id_lote: 2, codigo_fungivora: 'LOTE-NEW', fecha_lote: '2024-05-01T10:00:00Z' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Cargar y ordenar los lotes por fecha', async () => {
    vi.mocked(loteService.getLotes).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false), { timeout: 1000 });

    expect(result.current.datos[0].codigo_fungivora).toBe('LOTE-NEW');
    expect(result.current.datos).toHaveLength(2);
  });

  it('Refrescar automáticamente en 5 segundos', async () => {
    vi.useFakeTimers(); 
    vi.mocked(loteService.getLotes).mockResolvedValue(mockData);

    renderHook(() => useLotes());

    // Antes de refrescar
    await act(async () => {
      vi.advanceTimersByTime(0); 
    });

    expect(loteService.getLotes).toHaveBeenCalledTimes(1);

    // Despues de 5 segs
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(loteService.getLotes).toHaveBeenCalledTimes(2);
  });

  it('Estados de error', async () => {
    vi.mocked(loteService.getLotes).mockResolvedValue({ success: false });

    const { result } = renderHook(() => useLotes());

    await waitFor(() => expect(result.current.cargando).toBe(false));
    
    // Mensaje si no hay ningun lote
    expect(result.current.error).toBe("No se pudo obtener la lista de lotes");
  });

  it('Debe agregar un nuevo lote y refrescar la lista', async () => {
    const nuevoLote = { tipo_sustrato: "Paja", ubicacion_lote: "Granja" };
    vi.mocked(loteService.addLote).mockResolvedValue({ success: true });
    vi.mocked(loteService.getLotes).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLotes());

    let exito;
    await act(async () => {
      exito = await result.current.addLote(nuevoLote);
    });

    expect(exito).toBe(true);
    expect(loteService.addLote).toHaveBeenCalledWith(nuevoLote);
    // llamada a get lotes
    expect(loteService.getLotes).toHaveBeenCalledTimes(2);
  });
});
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useHome from '../../../features/home/hooks/useHome'; 
import homeService from '../../../features/home/services/home.service';

vi.mock('../../../features/home/services/home.service', () => ({
  default: {
    fetchDashboard: vi.fn(),
    revisarLotes: vi.fn(),
  }
}));

describe('useHome Hook', () => {
  const mockDashboardData = {
    lotesPendientes: 5,
    lotesRevisados: 12,
    alertas: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('debe iniciar cargando y luego guardar los datos del dashboard con éxito', async () => {
    vi.mocked(homeService.fetchDashboard).mockResolvedValue(mockDashboardData);

    const { result } = renderHook(() => useHome());

    expect(result.current.loading).toBe(true);
    expect(result.current.dashboard).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.dashboard).toEqual(mockDashboardData);
    expect(result.current.error).toBeNull();
    expect(homeService.fetchDashboard).toHaveBeenCalledTimes(1);
  });


  it('debe capturar el error traducido si el servicio fetchDashboard falla', async () => {
    const mockError = new Error('Network Error');
    vi.mocked(homeService.fetchDashboard).mockRejectedValue(mockError);

    const { result } = renderHook(() => useHome());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.dashboard).toBeNull();
    expect(result.current.error).toBeDefined(); 
    expect(typeof result.current.error).toBe('string');
  });


  it('debe ejecutar revisarLotes correctamente y refrescar los datos del dashboard', async () => {
    vi.mocked(homeService.revisarLotes).mockResolvedValue({ success: true });
    vi.mocked(homeService.fetchDashboard).mockResolvedValue(mockDashboardData);

    const { result } = renderHook(() => useHome());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(homeService.fetchDashboard).toHaveBeenCalledTimes(1);

    const idsALotes = [1, 2, 3];

    await act(async () => {
      await result.current.revisarLotes(idsALotes);
    });

    expect(homeService.revisarLotes).toHaveBeenCalledWith(idsALotes);
    expect(homeService.fetchDashboard).toHaveBeenCalledTimes(2); 
  });

  it('debe propagar (hacer throw) del error si revisarLotes falla', async () => {
    vi.mocked(homeService.fetchDashboard).mockResolvedValue(mockDashboardData);
    vi.mocked(homeService.revisarLotes).mockRejectedValue(new Error('Fallo al actualizar'));

    const { result } = renderHook(() => useHome());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(
      act(async () => {
        await result.current.revisarLotes([1]);
      })
    ).rejects.toThrow('Fallo al actualizar');
  });

  it('debe permitir refrescar manualmente el dashboard usando la función refetch', async () => {
    vi.mocked(homeService.fetchDashboard).mockResolvedValue(mockDashboardData);

    const { result } = renderHook(() => useHome());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.refetch();
    });

    expect(homeService.fetchDashboard).toHaveBeenCalledTimes(2);
  });
});
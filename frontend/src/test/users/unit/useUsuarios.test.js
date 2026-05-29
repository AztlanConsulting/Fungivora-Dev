import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useUsuarios from '../../../features/usuarios/hooks/useUsuarios';
import usuarioService from '../../../features/usuarios/services/usuarios.service';

vi.mock('../../../features/usuarios/services/usuarios.service', () => ({
  default: {
    getUsuarios: vi.fn(),
    addUsuario: vi.fn(),
    deleteUsuario: vi.fn(),
  }
}));

describe('useUsuarios Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar y listar usuarios correctamente', async () => {
    const mockData = { success: true, data: [{ id_usuario: 1, nombre_usuario: 'Admin' }] };
    vi.mocked(usuarioService.getUsuarios).mockResolvedValue(mockData);

    const { result } = renderHook(() => useUsuarios());
    
    expect(result.current.cargando).toBe(true);
    await waitFor(() => expect(result.current.cargando).toBe(false));
    
    expect(result.current.usuarios).toEqual(mockData.data);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar error 403 al listar', async () => {
    vi.mocked(usuarioService.getUsuarios).mockRejectedValue({ status: 403 });

    const { result } = renderHook(() => useUsuarios());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.error).toBe("No tienes permisos para ver esta sección");
  });

  it('debe eliminar un usuario y refrescar la lista', async () => {
    vi.mocked(usuarioService.getUsuarios).mockResolvedValue({ success: true, data: [] });
    vi.mocked(usuarioService.deleteUsuario).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useUsuarios());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    await act(async () => {
      const res = await result.current.deleteUsuario(1);
      expect(res.success).toBe(true);
    });

    expect(usuarioService.deleteUsuario).toHaveBeenCalledWith(1);
    expect(usuarioService.getUsuarios).toHaveBeenCalledTimes(2); 
  });
});
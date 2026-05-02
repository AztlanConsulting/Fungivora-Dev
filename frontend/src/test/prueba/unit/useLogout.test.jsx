import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import useLogout from '../../../features/hooks/useLogout';

// Mock navegación
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('useLogout — uso de hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem('token', 'test-token');
    });

    // Borra el token y redirije a la ruta del login "/"
    it('Borrar el token y navegar a login', async () => {
        const { result } = renderHook(() => useLogout(), {
            wrapper: BrowserRouter
        });

        await act(async () => {
            await result.current.ejecutarLogout();
        });

        expect(localStorage.getItem('token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
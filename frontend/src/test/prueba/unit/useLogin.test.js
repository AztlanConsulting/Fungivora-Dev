import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useLogin from '../../../features/hooks/useLogin'
import loginService from '../../../features/services/login.service'

vi.mock('../../../features/services/login.service', () => {
    return {
        default: {
            login: vi.fn()
        }
    }
})

describe('useLogin — Autenticación', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const store = {}
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: vi.fn((key, val) => { store[key] = val }),
                getItem: vi.fn((key) => store[key]),
            },
            writable: true
        })
        delete window.location
        window.location = { href: '' }
    })

    // Se genera el login exitoso
    it('Quarda token y login exitoso', async () => {
    const mockData = { token: 'jwt-123' };
    loginService.login.mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useLogin());

    let response;
    await act(async () => {
        response = await result.current.ejecutarLogin('admin', '123');
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-123');
    expect(response).toEqual(mockData);
    })

    // Las credenciales no son las correctas
    it('Error 401 (Credenciales)', async () => {
        loginService.login.mockRejectedValue({ response: { status: 401 } })
        
        const { result } = renderHook(() => useLogin())

        await act(async () => {
            try {
                await result.current.ejecutarLogin('u', 'p')
            } catch (e) {
            }
        })

        expect(result.current.error).toBe("Usuario y/o contraseña incorrectos")
        expect(result.current.cargando).toBe(false)
    })
})
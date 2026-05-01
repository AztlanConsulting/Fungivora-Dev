import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useLogin from '../../../features/hooks/useLogin'
import loginService from '../../../features/services/login.service'

// Mock explícito del servicio
vi.mock('../../../features/services/login.service', () => {
    return {
        default: {
            login: vi.fn()
        }
    }
})

describe('useLogin — Lógica de Autenticación', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Mock de localStorage
        const store = {}
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: vi.fn((key, val) => { store[key] = val }),
                getItem: vi.fn((key) => store[key]),
            },
            writable: true
        })
        // Mock de location
        delete window.location
        window.location = { href: '' }
    })

    it('guarda token y redirige en login exitoso', async () => {
        // Configuramos el mock para éxito
        loginService.login.mockResolvedValue({ token: 'jwt-123' })
        
        const { result } = renderHook(() => useLogin())

        await act(async () => {
            await result.current.ejecutarLogin('admin', '123')
        })

        expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-123')
        expect(window.location.href).toBe('/first')
    })

    it('maneja error 401 (Credenciales)', async () => {
        // Configuramos el mock para fallo
        loginService.login.mockRejectedValue({ response: { status: 401 } })
        
        const { result } = renderHook(() => useLogin())

        await act(async () => {
            try {
                await result.current.ejecutarLogin('u', 'p')
            } catch (e) {
                // El catch es necesario para que el test no se detenga aquí
            }
        })

        // Ahora el estado de error de useLogin ya debería estar seteado
        expect(result.current.error).toBe("Usuario y/o contraseña incorrectos")
        expect(result.current.cargando).toBe(false)
    })
})
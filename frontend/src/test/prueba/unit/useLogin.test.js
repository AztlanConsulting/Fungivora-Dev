import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useLogin from '../../../features/hooks/useLogin'
import loginService from '../../../features/services/login.service'

// Mock del servicio
vi.mock('../services/login.service')

describe('useLogin — Lógica de Autenticación', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Mock de localStorage y window.location
        Object.defineProperty(window, 'localStorage', { value: { setItem: vi.fn() }, writable: true })
        delete window.location
        window.location = { href: vi.fn() }
    })

    it('debe iniciar con estado limpio', () => {
        const { result } = renderHook(() => useLogin())
        expect(result.current.cargando).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('guarda token y redirige en login exitoso', async () => {
        loginService.login.mockResolvedValue({ token: 'jwt-123' })
        const { result } = renderHook(() => useLogin())

        await act(async () => {
            await result.current.ejecutarLogin('admin', '123')
        })

        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-123')
        expect(window.location.href).toBe('/first')
    })

    it('maneja error 401 (Credenciales)', async () => {
        const error401 = { response: { status: 401 } }
        loginService.login.mockRejectedValue(error401)
        
        const { result } = renderHook(() => useLogin())

        try {
            await act(async () => { await result.current.ejecutarLogin('u', 'p') })
        } catch (e) {
            expect(result.current.error).toBe("Usuario y/o contraseña incorrectos")
        }
    })
})
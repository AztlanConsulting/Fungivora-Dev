import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Login } from '../../../pages'
import useLogin from "../../../features/login/hooks/useLogin"

vi.mock('../../../features/login/hooks/useLogin', () => ({
    default: vi.fn()
}))

vi.mock('../../../shared/components/ui/inputs/InputTexto', () => ({
    default: (props) => <input {...props} />
}))

vi.mock('../../../shared/components/ui/buttons/Botones', () => ({
    default: ({ children, disabled, type, ...props }) => (
        <button type={type} disabled={disabled} {...props}>
            {children}
        </button>
    )
}))

vi.mock('../../../shared/components/ui/basics/Texto', () => ({
    default: ({ children }) => <span>{children}</span>
}))

// Assets
vi.mock('../../../assets/images/fondo-fungivora.png', () => ({ default: '' }))
vi.mock('../../../assets/images/fondo-fungivora-plano.png', () => ({ default: '' }))
vi.mock('@hugeicons/react', () => ({
    HugeiconsIcon: () => <div data-testid="icon" />
}))

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>)

describe('Login — Pruebas completas', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true
        });
    });

    it('Flujo completo', async () => {
        const user = userEvent.setup();
        const mockEjecutarLogin = vi.fn().mockResolvedValue(true);

        vi.mocked(useLogin).mockReturnValue({
            ejecutarLogin: mockEjecutarLogin,
            cargando: false,
            error: null,
            limpiarError: vi.fn()
        });

        renderWithRouter(<Login />);

        await user.type(screen.getByPlaceholderText(/Escribe tu usuario/i), 'Eli');
        await user.type(screen.getByPlaceholderText(/Escribe tu contraseña/i), '123');
        
        const form = document.querySelector('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockEjecutarLogin).toHaveBeenCalledWith('Eli', '123');
        });

        expect(window.location.href).toBe('/home');
    });

    it('Mensajes de error (401, 500, etc)', async () => {
        vi.mocked(useLogin).mockReturnValue({
            ejecutarLogin: vi.fn(),
            cargando: false,
            error: "Usuario y/o contraseña incorrectos",
            limpiarError: vi.fn()
        });

        renderWithRouter(<Login />);
        expect(screen.getByText(/Usuario y\/o contraseña incorrectos/i)).toBeInTheDocument();
    });

    it('Botón deshabilitado al cargar', async () => {
        vi.mocked(useLogin).mockReturnValue({
            ejecutarLogin: vi.fn(),
            cargando: true,
            error: null,
            limpiarError: vi.fn()
        });

        renderWithRouter(<Login />);
        expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
    });
})
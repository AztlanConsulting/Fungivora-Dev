import { render, screen, fireEvent} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsuariosView from '../../../pages/users/UsuariosView';
import useUsuarios from '../../../features/usuarios/hooks/useUsuarios';

vi.mock("../../../features/usuarios/hooks/useUsuarios", () => ({
    default: vi.fn()
}));

vi.mock('../../../features/usuarios/components/FormCrearUsuario', () => ({
    default: ({ onGuardar }) => <button onClick={onGuardar}>MockFormGuardar</button>
}));

describe('Vista Usuarios', () => {
    const mockUsuarios = [
        { id_usuario: 1, nombre_usuario: "Admin", is_user_admin: 1 },
        { id_usuario: 2, nombre_usuario: "Juan", is_user_admin: 0 }
    ];

    beforeEach(() => {
        vi.mocked(useUsuarios).mockReturnValue({
            usuarios: mockUsuarios,
            cargando: false,
            error: null,
            addUsuario: vi.fn().mockResolvedValue({ success: true }),
            deleteUsuario: vi.fn().mockResolvedValue({ success: true }),
            refresh: vi.fn()
        });
    });

    it('debe renderizar la lista de usuarios', () => {
        render(<UsuariosView />);

        const admins = screen.getAllByText("Admin");
        expect(admins.length).toBeGreaterThan(0);
        
        const juanes = screen.getAllByText("Juan");
        expect(juanes.length).toBeGreaterThan(0);
    });

    it('debe cambiar de vista al presionar Crear Usuario', () => {
        render(<UsuariosView />);
        const boton = screen.getByLabelText(/Crear Usuario/i);
        fireEvent.click(boton);
        expect(screen.getByText("MockFormGuardar")).toBeInTheDocument();
    });

    it('debe mostrar estado de carga', () => {
        vi.mocked(useUsuarios).mockReturnValue({
            usuarios: [],
            cargando: true,
            error: null,
            addUsuario: vi.fn(),
            deleteUsuario: vi.fn(),
            refresh: vi.fn()
        });
        render(<UsuariosView />);
        expect(screen.getByText(/Cargando datos de usuario/i)).toBeInTheDocument();
    });
});
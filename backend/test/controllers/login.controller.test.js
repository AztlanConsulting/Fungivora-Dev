const { post_login } = require('../../controllers/inicio_sesion.controller');
const Usuario = require('../../models/usuario.model'); // Ajusta la ruta a tu modelo
const { generarToken } = require('../../util/jwtUtils');

// Mocks
jest.mock('../../models/usuario.model');
jest.mock('../../util/jwtUtils');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Auth Controller — post_login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('responde 404 si el usuario no existe', async () => {
        Usuario.fetch_one.mockResolvedValue(null);

        const req = { body: { nombre_usuario: 'inexistente', contrasena: '123' } };
        const res = mockRes();

        await post_login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'identificador' }));
    });

    it('responde 401 si la contraseña es incorrecta', async () => {
        Usuario.fetch_one.mockResolvedValue({
            nombre_usuario: 'testuser',
            contrasena_usuario: 'correcta'
        });

        const req = { body: { nombre_usuario: 'testuser', contrasena: 'incorrecta' } };
        const res = mockRes();

        await post_login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'password' }));
    });

    it('responde 200 y devuelve un token si las credenciales son válidas', async () => {
        const mockUser = {
            id_usuario: 1,
            nombre_usuario: 'admin',
            contrasena_usuario: 'secret',
            is_user_admin: 1
        };
        Usuario.fetch_one.mockResolvedValue(mockUser);
        generarToken.mockReturnValue('token_falso_123');

        const req = { body: { nombre_usuario: 'admin', contrasena: 'secret' } };
        const res = mockRes();

        await post_login(req, res);

        expect(generarToken).toHaveBeenCalledWith({ id: 1, isAdmin: true });
        expect(res.json).toHaveBeenCalledWith({ token: 'token_falso_123' });
    });
});
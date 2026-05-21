const { post_login } = require('../../controllers/inicio_sesion.controller');
const Usuario = require('../../models/usuario.model');
const { generarToken } = require('../../util/jwtUtils');

// Mocks de la base y los tokens
jest.mock('../../models/usuario.model');
jest.mock('../../util/jwtUtils', () => ({ generarToken: jest.fn() }));

jest.mock('bcrypt');
const bcrypt = require('bcrypt');

// Helper que crea req/res falsos
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Login Controller — post_login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Silencia los console.errors y los console.log intencionales
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    // Cuando el usuario/contraseña no existe de ninguna forma en la base de datos
    it('404 Not Found - el usuario no existe', async () => {
        Usuario.fetch_one.mockResolvedValue(null);

        const req = { body: { nombre_usuario: 'inexistente', contrasena: '123' } };
        const res = mockRes();

        await post_login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: 'identificador', //El identificador es usuario o contraseña
            msg: "El usuario o correo no están registrados"
        }));
    });

    // Cuando la contraseña es incorrecta aunque el usuario si exista
    it('401 Unauthorized - la contraseña es incorrecta', async () => {
        Usuario.fetch_one.mockResolvedValue({
            nombre_usuario: 'testuser',
            contrasena_usuario: 'correcta'
        });

        bcrypt.compare.mockResolvedValue(false);

        const req = { body: { nombre_usuario: 'testuser', contrasena: 'incorrecta' } };
        const res = mockRes();

        await post_login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: 'password',
            msg: "Contraseña incorrecta"
        }));
    });

    // Permite el login al usuario y contraseña estar bien
    it('200 OK -  token de credenciales válidas', async () => {
        const mockUser = {
            id_usuario: 1,
            nombre_usuario: 'admin',
            contrasena_usuario: 'secret',
            is_user_admin: 1
        };
        Usuario.fetch_one.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        generarToken.mockReturnValue('token_valido_xyz');

        const req = { body: { nombre_usuario: 'admin', contrasena: 'secret' } };
        const res = mockRes();

        await post_login(req, res);
        expect(generarToken).toHaveBeenCalledWith({ id: 1, isAdmin: true });
        expect(res.json).toHaveBeenCalledWith({ token: 'token_valido_xyz' });
    });

    // No se puede conectar a la base de datos, genera error
    it('500 Internal Server Error - e una falla en la DB', async () => {
        Usuario.fetch_one.mockRejectedValue(new Error('DB Connection Failed'));

        const req = { body: { nombre_usuario: 'admin', contrasena: 'secret' } };
        const res = mockRes();

        await post_login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Error en login" });
    });
});
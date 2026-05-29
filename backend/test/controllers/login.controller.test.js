const { post_login } = require('../../controllers/inicio_sesion.controller');
const Usuario = require('../../models/usuario.model');
const { generarRefreshToken } = require('../../util/jwtUtils');

// Mocks de la base y los tokens
jest.mock('../../models/usuario.model');
jest.mock('../../util/jwtUtils', () => ({ generarRefreshToken: jest.fn() }));

jest.mock('bcrypt');
const bcrypt = require('bcrypt');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Login Controller — post_login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    it('404 Not Found - el usuario no existe', async () => {
        Usuario.fetch_one.mockResolvedValue(null);

        const req = { body: { nombre_usuario: 'inexistente', contrasena: '123' } };
        const res = mockRes();

        await post_login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: 'identificador',
            msg: "El usuario o correo no están registrados"
        }));
    });

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

    it('200 OK - token de credenciales válidas', async () => {
        const mockUser = {
            id_usuario: 1,
            nombre_usuario: 'admin',
            contrasena_usuario: 'secret',
            is_user_admin: 1
        };
        Usuario.fetch_one.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        generarRefreshToken.mockReturnValue('token_valido_xyz');

        const req = { body: { nombre_usuario: 'admin', contrasena: 'secret' } };
        const res = mockRes();

        await post_login(req, res);
        
        expect(generarRefreshToken).toHaveBeenCalledWith({ id_usuario: 1, is_user_admin: 1 });
        expect(res.json).toHaveBeenCalledWith({ token: 'token_valido_xyz' });
    });

    it('500 Internal Server Error - e una falla en la DB', async () => {
        Usuario.fetch_one.mockRejectedValue(new Error('DB Connection Failed'));

        const req = { body: { nombre_usuario: 'admin', contrasena: 'secret' } };
        const res = mockRes();

        await post_login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Error en login" });
    });
});
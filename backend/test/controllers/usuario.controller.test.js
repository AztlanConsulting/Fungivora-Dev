const { post_crear_usuario, get_usuarios } = require('../../controllers/usuario.controller');
const Usuario = require('../../models/usuario.model');
const bcrypt = require('bcrypt');

jest.mock('../../models/usuario.model');
jest.mock('bcrypt');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Usuario Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('post_crear_usuario', () => {
        it('201 - usuario creado exitosamente', async () => {
            Usuario.fetch_one.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_pw');
            
            const req = { body: { nombre_usuario: 'user1', correo_usuario: 'u@u.com', contrasena_usuario: '123' } };
            const res = mockRes();

            await post_crear_usuario(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(Usuario.crear).toHaveBeenCalled();
        });

        it('400 - usuario ya existe', async () => {
            Usuario.fetch_one.mockResolvedValue({ id: 1 });
            const req = { body: { nombre_usuario: 'user1' } };
            const res = mockRes();

            await post_crear_usuario(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('get_usuarios', () => {
        it('200 - devuelve lista de usuarios', async () => {
            Usuario.fetch_all.mockResolvedValue([{ nombre_usuario: 'user1' }]);
            const res = mockRes();

            await get_usuarios({}, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });
});
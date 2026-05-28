const request = require('supertest');
const app = require('../../app');
const Usuario = require('../../models/usuario.model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/usuario.model');

describe('Usuario Routes', () => {
    const JWT_SECRET = process.env.APP_ACCESS_KEY || "test_secret_key";
    let tokenValido;

    beforeAll(() => {
        tokenValido = jwt.sign({ id: 1, isAdmin: true }, JWT_SECRET);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/usuarios/crear', () => {
        it('201 - debe registrar usuario correctamente', async () => {
            Usuario.fetch_one.mockResolvedValue(null);
            Usuario.crear.mockResolvedValue([{}]);

            const res = await request(app)
                .post('/api/usuarios/crear')
                .set('authorization', `Bearer ${tokenValido}`) 
                .send({
                    nombre_usuario: 'nuevo',
                    correo_usuario: 'n@n.com',
                    contrasena_usuario: 'pass123',
                    estatus_usuario: 'Activo'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });
    });

    describe('GET /api/usuarios/listar', () => {
        it('200 - debe listar usuarios', async () => {
            Usuario.fetch_all.mockResolvedValue([{ nombre_usuario: 'user1' }]);

            const res = await request(app)
                .get('/api/usuarios/listar')
                .set('authorization', `Bearer ${tokenValido}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
});
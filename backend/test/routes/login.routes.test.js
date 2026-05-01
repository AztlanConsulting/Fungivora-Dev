const request = require('supertest');
const app = require('../../app');
const Usuario = require('../../models/usuario.model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/usuario.model');

describe('Auth Routes /api/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('debería fallar con 401 si la contraseña no coincide', async () => {
            Usuario.fetch_one.mockResolvedValue({
                contrasena_usuario: 'password_real'
            });

            const res = await request(app)
                .post('/api/login') // Ajusta según tu prefijo de ruta
                .send({ nombre_usuario: 'user', contrasena: 'error' });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('Acceso Protegido /usuario', () => {
        it('debería responder "No autorizado" si no hay token', async () => {
            const res = await request(app).get('/api/login/usuario');
            
            // Según tu middleware, devuelves un JSON con mensaje
            expect(res.body.msg).toBe('No autorizado');
        });

        it('debería permitir el acceso con un token válido', async () => {
            // Generamos un token válido para el test usando el mismo secreto del middleware
            const token = jwt.sign({ id: 1, isAdmin: true }, "secreto_super_seguro");

            const res = await request(app)
                .get('/api/login/usuario')
                .set('authorization', token);

            expect(res.statusCode).toBe(200);
            expect(res.body.msg).toBe('Acceso autorizado');
        });
    });
});
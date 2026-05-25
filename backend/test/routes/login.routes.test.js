const request = require('supertest');
const app = require('../../app'); 
const Usuario = require('../../models/usuario.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtUtils = require('../../util/jwtUtils');

// Mocks de los modelos
jest.mock('../../models/usuario.model');
jest.mock('../../util/jwtUtils', () => {
    const originalModule = jest.requireActual('../../util/jwtUtils');
    const cltSecret = process.env.APP_ACCESS_KEY || "test_secret_key";
    return {
        ...originalModule,
        SECRET: cltSecret,
        generarRefreshToken: (payload) => require('jsonwebtoken').sign({ id: payload.id }, cltSecret, { expiresIn: '24h' })
    };
});

// Mock de métricas 
jest.mock('../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

describe('Auth Routes — /api/login', () => {

    const JWT_SECRET = process.env.APP_ACCESS_KEY || "test_secret_key";

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    describe('POST /', () => {
        it('Error 404 - usuario no existe', async () => {
            Usuario.fetch_one.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/login')
                .send({ nombre_usuario: 'desconocido', contrasena: '123' });

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('identificador');
        });

        it('Error 401 - contraseña es incorrecta', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            const mockUser = {
                id_usuario: 10,
                id: 10,
                nombre_usuario: 'user123',
                contrasena_usuario: '$2b$10$hashSimuladoCualquiera',
                is_user_admin: 0
            };

            Object.assign(mockUser, { 0: mockUser }); 
            Usuario.fetch_one.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/login')
                .send({ nombre_usuario: 'user123', contrasena: 'password_erronea' });

            expect(res.statusCode).toBe(401);
            expect(res.body.msg).toBe('Contraseña incorrecta');
        });

        it('Mensaje 200 - entregar token de credenciales válidas', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const mockUser = {
                id_usuario: 10,
                id: 10,
                nombre_usuario: 'user123',
                contrasena_usuario: '$2b$10$hashSimuladoCualquiera',
                is_user_admin: 0,
                isAdmin: false
            };

            Object.assign(mockUser, { 0: mockUser });
            Usuario.fetch_one.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/login')
                .send({ nombre_usuario: 'user123', contrasena: '12345' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
    });

    describe('GET /usuario', () => {
        it('Mensaje "No autorizado" - token faltante', async () => {
            const res = await request(app).get('/api/login/usuario');
            expect(res.body.msg).toBe('No autorizado: Token faltante');
        });

        it('Mensaje 200 -  token válido', async () => {
            const tokenValido = jwt.sign(
                { id: 10, isAdmin: true },
                JWT_SECRET
            );

            const res = await request(app)
                .get('/api/login/usuario')
                .set('authorization', `Bearer ${tokenValido}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.msg).toBe('Acceso autorizado');
        });

        it('Mensaje "Token inválido" - token corrupto', async () => {
            const res = await request(app)
                .get('/api/login/usuario')
                .set('authorization', 'Bearer este-no-es-un-token-real');

            expect(res.body.msg).toBe('Token inválido');
        });
    });
});
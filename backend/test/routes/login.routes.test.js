const request = require('supertest');

jest.mock('../../models/usuario.model');

jest.mock('../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

const app = require('../../app');
const Usuario = require('../../models/usuario.model');
const jwt = require('jsonwebtoken');

describe('Auth Routes — /api/login', () => {
    
    // El secreto es necesario, es el token "seguro"
    const JWT_SECRET = "secreto_super_seguro";

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    // Pruebas para todo lo relacionado con POST, como las de controller
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
            Usuario.fetch_one.mockResolvedValue({
                nombre_usuario: 'user123',
                contrasena_usuario: 'password_correcta'
            });

            const res = await request(app)
                .post('/api/login')
                .send({ nombre_usuario: 'user123', contrasena: 'password_erronea' });

            expect(res.statusCode).toBe(401);
            expect(res.body.msg).toBe('Contraseña incorrecta');
        });

        it('Mensaje 200 - entregar token de credenciales válidas', async () => {
            Usuario.fetch_one.mockResolvedValue({
                id_usuario: 10,
                nombre_usuario: 'user123',
                contrasena_usuario: '12345',
                is_user_admin: 0
            });

            const res = await request(app)
                .post('/api/login')
                .send({ nombre_usuario: 'user123', contrasena: '12345' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
    });

    // Pruebas de Get, para validar el usuario y su token
    describe('GET /usuario', () => {
        it('Mensaje "No autorizado" - token faltante', async () => {
            const res = await request(app).get('/api/login/usuario');
            expect(res.body.msg).toBe('No autorizado');
        });

        // El token es valido, relacionado con el usuario que esta ingresando
        it('Mensaje 200 -  token válido', async () => {
            const SECRET_PARA_TEST = "secreto_super_seguro"; 

            const tokenValido = jwt.sign(
                { id: 10, isAdmin: true }, 
                SECRET_PARA_TEST
            );

            const res = await request(app)
                .get('/api/login/usuario')
                .set('authorization', tokenValido);
            expect(res.statusCode).toBe(200);
            expect(res.body.msg).toBe('Acceso autorizado');
        });

        // En caso que el token no sea el "secreto_super_seguro" asignado
        it('Mensaje "Token inválido" - token corrupto', async () => {
            const res = await request(app)
                .get('/api/login/usuario')
                .set('authorization', 'este-no-es-un-token-real');

            expect(res.body.msg).toBe('Token inválido');
        });
    });
});
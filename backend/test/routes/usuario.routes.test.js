const request = require('supertest');

// Mockea db y metrics ANTES de importar app
jest.mock('../../util/db');

{/* Metrics es mockeado debido a que sin el
    mock, Jest intentaría inicializar Grafana */}
jest.mock('../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

//mocks de auth y rbac
jest.mock('../../middleware/auth', () => (req, res, next) => next());
jest.mock('../../middleware/rbac', () => () => (req, res, next) => next());

jest.mock('bcrypt')
jest.mock('../../models/usuario.model');


const Usuario = require('../../models/usuario.model');
const bcrypt = require('bcrypt')


const app = require('../../app');

describe('POST /api/usuario/anadir', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Silencia los console.errors que provocamos intencionalmente
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });


    // ─── Casos exitosos ───────────────────────────────────────────────────────

    //Caso exitoso de registro
    it('responde 201 cuando hay registro exitoso', async () => {
        
        const registroNuevo= { insertId: 42}
        Usuario.fetch_one.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedpassword')
        Usuario.anadir.mockResolvedValue(registroNuevo);

        const res = await request (app)
            .post('/api/usuario/anadir')
            .send({
                nombre_usuario: 'Juanperez',
                correo_usuario: 'juan@test.com',
                contrasena: '123'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({ 
            msg: 'Usuario creado', id: 42 
        });
    });

    // ─── Casos de error ───────────────────────────────────────────────────────

    //Los campos estan vacios
    it('responde 400 si faltan todos los campos', async () => {
    
            const res = await request (app)
            .post('/api/usuario/anadir')
            .send({
                nombre_usuario: '',
                correo_usuario: '',
                contrasena: ''
        });
    
            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
                msg: 'Llena todos los campos.'
            });
        });
    //Correo ya esta registrado
    it('responde 409 si el correo ya está registrado', async () => {

        const usuarioExistente = { 
            id: 1, 
            correo_usuario: 'juan@test.com', 
            nombre_usuario: 'Juanfalso'             
        };

        Usuario.fetch_one.mockResolvedValueOnce(usuarioExistente);
        

        const res = await request (app)
            .post('/api/usuario/anadir')
            .send({
                nombre_usuario: 'Juanperez',
                correo_usuario: 'juan@test.com',
                contrasena: '123'
        });

        expect(res.statusCode).toBe(409);
        expect(res.body).toMatchObject({
                msg: 'Hay un usuario registrado con ese correo, agregue otro correo'
        });
    });

    //La DB falla
    it('responde 500 si la DB falla', async () => {
        Usuario.fetch_one.mockRejectedValue(new Error('Connection lost'));
        
        const res = await request (app)
            .post('/api/usuario/anadir')
            .send({
                nombre_usuario: 'Juanperez',
                correo_usuario: 'juan@test.com',
                contrasena: '123'
        });

        expect(res.statusCode).toBe(500);
            expect(res.body).toMatchObject({
                msg: 'Error al registrar usuario'
        });
    });

    // ─── Formato de respuesta ─────────────────────────────────────────────────

    it('responde con Content-Type application/json', async () => {
        const registroNuevo = {insertId: 1 };
        Usuario.fetch_one.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedpassword')
        Usuario.anadir.mockResolvedValue(registroNuevo);

        const res = await request (app)
            .post('/api/usuario/anadir')
            .send({
                nombre_usuario: 'Juanperez',
                correo_usuario: 'juan@test.com',
                contrasena: '123'
        });
        
        expect(res.headers['content-type']).toMatch(/application\/json/);
    });
});
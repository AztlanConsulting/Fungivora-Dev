const request = require('supertest');
const app = require('../../app');
const Categoria = require('../../models/categoria.model');
const jwt = require('jsonwebtoken');

// Mockea el modelo Categoria
jest.mock('../../models/categoria.model');
const fetchCategoriasMock = Categoria.fetchCategorias;
const fetchOpcionesMock = Categoria.fetchOpciones;

describe('Rutas de Categorías', () => {
    let tokenTest;

    beforeAll(() => {
        const SECRET = process.env.APP_ACCESS_KEY || 'test_secret_key';
        tokenTest = jwt.sign({ id: 1, usuario: 'test_user', isAdmin: true }, SECRET, { expiresIn: '1h' });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('GET /api/categorias', () => {
        it('responde 200 con las categorías cuando la DB funciona correctamente', async () => {
            fetchCategoriasMock.mockResolvedValue([[{ id: 1, nombre: 'Categoria 1' }, { id: 2, nombre: 'Categoria 2' }]]);

            const res = await request(app)
                .get('/api/categorias')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                data: [{ id: 1, nombre: 'Categoria 1' }, { id: 2, nombre: 'Categoria 2' }],
            });
        });

        it('responde 500 cuando la DB falla', async () => {
            fetchCategoriasMock.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .get('/api/categorias')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(500);
            expect(res.body).toMatchObject({
                success: false,
                message: 'Error al obtener las categorias',
            });
        });
    });

    describe('GET /api/categorias/opciones', () => {
        it('responde 200 con las opciones de la categoría cuando la DB funciona correctamente', async () => {
            fetchOpcionesMock.mockResolvedValue([[{ id: 1, nombre: 'Opcion 1' }, { id: 2, nombre: 'Opcion 2' }]]);

            const res = await request(app)
                .get('/api/categorias/opciones?categoria=Especies&abreviado=false')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                data: [{ id: 1, nombre: 'Opcion 1' }, { id: 2, nombre: 'Opcion 2' }],
            });
        });

        it('responde 500 cuando la DB falla', async () => {
            fetchOpcionesMock.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .get('/api/categorias/opciones?categoria=Especies&abreviado=false')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(500);
            expect(res.body).toMatchObject({
                success: false,
                message: 'Error al obtener las opciones',
            });
        });

        it('utiliza "Especies" como valor predeterminado para el parámetro "categoria" cuando no se proporciona', async () => {
            fetchOpcionesMock.mockResolvedValue([[{ id: 1, nombre: 'Opcion 1' }]]);

            await request(app)
                .get('/api/categorias/opciones?abreviado=false')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(Categoria.fetchOpciones).toHaveBeenCalledWith('Especies', false);
        });
    });
});
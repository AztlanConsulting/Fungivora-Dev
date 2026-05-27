const request = require('supertest');
const app = require('../../app'); 
const Inventario = require('../../models/inventario.model');
const Categoria = require('../../models/categoria.model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/inventario.model');
jest.mock('../../models/categoria.model');

describe('Inventario Routes', () => {
    let tokenTest; 
    
    beforeAll(() => {
        const SECRET = process.env.APP_ACCESS_KEY || 'test_secret_key';
        tokenTest = jwt.sign({ id: 1, usuario: 'test_user', isAdmin: true }, SECRET, { expiresIn: '1h' });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('200 - lista de inventario', async () => {
            const mockData = [{ id: 1, nombre: 'Bolsas de cultivo', cantidad: 100 }];
            Inventario.fetch_all.mockResolvedValue(mockData);

            const res = await request(app)
                .get('/api/inventario')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockData);
        });

        it('500 - falla en base de datos', async () => {
            Inventario.fetch_all.mockRejectedValue(new Error('DB Error'));

            const res = await request(app)
                .get('/api/inventario')
                .set('Authorization', `Bearer ${tokenTest}`); 

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /unidades', () => {
        it('200 - unidades disponibles', async () => {
            const mockUnidades = [['kg', 'g', 'L', 'ml']];
            Categoria.fetchOpciones.mockResolvedValue(mockUnidades);

            const res = await request(app)
                .get('/api/inventario/unidades')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockUnidades[0]);
        });
    });

    describe('POST /crear-insumo', () => {
        it('400 - insumo repetido', async () => {
            Inventario.fetch_all.mockResolvedValue([{ nombre: 'Trigo' }]);

            const res = await request(app)
                .post('/api/inventario/crear-insumo')
                .set('Authorization', `Bearer ${tokenTest}`)
                .send({ nombre: 'trigo', cantidad: 10, stock_recomendado: 5, unidad: 'kg' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('El insumo ya existe');
        });

        it('500 - base de datos desconectada', async () => {
            Inventario.update_cantidad.mockRejectedValue(new Error('Connection timed out'));

            const res = await request(app)
                .post('/api/inventario/update-cantidad') 
                .set('Authorization', `Bearer ${tokenTest}`) 
                .send({ id_insumo: 'uuid-existente', cantidad: 20 });

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('Error interno del servidor');
        });
    });
});
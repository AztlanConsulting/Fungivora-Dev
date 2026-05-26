const request = require('supertest');
const app = require('../../app'); 
const Micelio = require('../../models/micelio.model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/micelio.model');


describe('Micelio Routes', () => {
    let tokenTest; 
    
    beforeAll(() => {
        const SECRET = process.env.APP_ACCESS_KEY || 'test_secret_key';
        tokenTest = jwt.sign({ id: 1, usuario: 'test_user', isAdmin: true }, SECRET, { expiresIn: '1h' });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /crear-medio-liquido', () => {

        it('201 - creación exitosa a través del endpoint', async () => {
            Micelio.anadir.mockResolvedValue({ insertId: 10 });

            const res = await request(app)
                .post('/api/micelio/crear-medio-liquido')
                .set('Authorization', `Bearer ${tokenTest}`)
                .send({
                    id_usuario: 1,
                    id_base: 2,
                    cantidad_final: 250,
                    ingredientes: []
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Medio líquido creado y stock actualizado correctamente');
        });

        it('500 - error interno del servidor al procesar la ruta', async () => {
            Micelio.anadir.mockRejectedValue(new Error('Transaction Failed'));

            const res = await request(app)
                .post('/api/micelio/crear-medio-liquido')
                .set('Authorization', `Bearer ${tokenTest}`)
                .send({ id_usuario: 1, ingredientes: [] });

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Error en la transacción');
        });
    });

    describe('GET /agares-base', () => {

        it('200 - devuelve la lista de agares base correctamente', async () => {
            const mockAgares = [[
                { id_micelio_sustrato: 1, tipo: 'Agar', fecha: '2026-05-26' }
            ]];
            Micelio.fetchAllAgares.mockResolvedValue(mockAgares);

            const res = await request(app)
                .get('/api/micelio/agares-base')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockAgares[0]);
        });
    });
});
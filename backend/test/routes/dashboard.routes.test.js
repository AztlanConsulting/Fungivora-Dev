const request = require('supertest');
const app = require('../../app'); 
const Dashboard = require('../../models/dashboard.model');
const jwt = require('jsonwebtoken');

// Mockear el modelo
jest.mock('../../models/dashboard.model');

describe('Dashboard Routes', () => {
    let tokenTest;

    beforeAll(() => {
        const SECRET = process.env.APP_ACCESS_KEY || 'test_secret_key';
        tokenTest = jwt.sign({ id: 1, usuario: 'test_user', isAdmin: true }, SECRET, { expiresIn: '1h' });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        
        it('200 - responde exitosamente con la estructura completa del dashboard', async () => {
            Dashboard.fetch_lotes_revision.mockResolvedValue([]);
            Dashboard.fetch_lotes_activos.mockResolvedValue(10);
            Dashboard.fetch_bloques_por_estado.mockResolvedValue(0);
            Dashboard.fetch_inventario_bajo.mockResolvedValue([]);

            const res = await request(app)
                .get('/api/dashboard') 
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('cards');
            expect(res.body).toHaveProperty('listas');
            expect(res.body).toHaveProperty('lotes');
            expect(res.body.cards.lotesActivos).toBe(10);
        });

        it('500 - maneja fallos internos del servidor', async () => {
            Dashboard.fetch_lotes_revision.mockRejectedValue(new Error('Internal connection error'));

            const res = await request(app)
                .get('/api/dashboard')
                .set('Authorization', `Bearer ${tokenTest}`);

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({
                message: 'Error obteniendo dashboard'
            });
        });
    });
});
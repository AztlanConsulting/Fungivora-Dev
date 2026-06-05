const request = require('supertest');

jest.mock('web-push', () => ({
    setVapidDetails: jest.fn(),
    sendNotification: jest.fn(),
}));

const app = require('../../app');
const Micelio = require('../../models/micelio.model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/micelio.model');
jest.mock('../../models/inventario.model');
jest.mock('../../util/db', () => ({
    getConnection: jest.fn()
}));

const db = require('../../util/db');

describe('Micelio Routes', () => {
    let tokenTest;

    beforeAll(() => {
        const SECRET = process.env.APP_ACCESS_KEY || 'test_secret_key';
        tokenTest = jwt.sign({ id: 1, usuario: 'test_user', isAdmin: true }, SECRET, { expiresIn: '1h' });
    });

    const mockConn = {
        beginTransaction: jest.fn().mockResolvedValue(),
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
        release: jest.fn().mockReturnValue(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        db.getConnection.mockResolvedValue(mockConn);
    });

    describe('POST /crear-medio-liquido', () => {


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
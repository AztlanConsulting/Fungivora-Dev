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

const app = require('../../app');
const db = require('../../util/db');

describe('GET /api/prueba/estres', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Silencia los console.errors que provocamos intencionalmente
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('responde 200 con los campos esperados', async () => {
        db.execute.mockResolvedValue([[{ id: 1 }, { id: 2 }]]);

        const res = await request(app).get('/api/prueba/estres');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            status: 'success',
            datos_recuperados: 2,
        });
        expect(res.body.tiempo_respuesta).toMatch(/^\d+ms$/);
    });

    it('responde 500 cuando la DB falla', async () => {
        db.execute.mockRejectedValue(new Error('Timeout'));

        const res = await request(app).get('/api/prueba/estres');

        expect(res.statusCode).toBe(500);
        expect(res.body).toMatchObject({
            status: 'error',
            error: 'Timeout',
        });
    });

    it('responde con Content-Type application/json', async () => {
        db.execute.mockResolvedValue([[{ id: 1 }]]);

        const res = await request(app).get('/api/prueba/estres');

        expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    it('endpoint base /api responde con mensaje de operatividad', async () => {
        const res = await request(app).get('/api');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('mensaje');
    });
});
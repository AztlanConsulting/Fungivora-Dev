const request = require('supertest');

jest.mock('../../../util/db');

jest.mock('../../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

jest.mock('../../../models/inoculo.model');
const Inoculo = require('../../../models/inoculo.model');

const app = require('../../../app');

describe('GET /api/inoculos/cantidad-ingredientes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    // ─── Casos exitosos ───────────────────────────────────────────────────────

    it('responde 200 con success true y la lista de ingredientes', async () => {
        const ingredientesMock = [
            { id: 1, nombre: 'Agua', cantidad: 5000 },
            { id: 2, nombre: 'Peptona', cantidad: 500 },
        ];
        Inoculo.fetchCantidadIngredientes.mockResolvedValue([ingredientesMock]);

        const res = await request(app).get('/api/inoculos/cantidad-ingredientes');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: ingredientesMock,
        });
    });

    it('responde 200 con data vacío si no hay ingredientes registrados', async () => {
        Inoculo.fetchCantidadIngredientes.mockResolvedValue([[]]);

        const res = await request(app).get('/api/inoculos/cantidad-ingredientes');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: [],
        });
    });

    // ─── Casos de error ───────────────────────────────────────────────────────

    it('responde 500 cuando la DB falla', async () => {
        Inoculo.fetchCantidadIngredientes.mockRejectedValue(new Error('Connection lost'));

        const res = await request(app).get('/api/inoculos/cantidad-ingredientes');

        expect(res.statusCode).toBe(500);
        expect(res.body).toMatchObject({
            success: false,
            message: 'Error al obtener la cantidad de ingredientes',
        });
    });

    // ─── Formato de respuesta ─────────────────────────────────────────────────

    it('responde con Content-Type application/json', async () => {
        Inoculo.fetchCantidadIngredientes.mockResolvedValue([[{ id: 1, nombre: 'Agua', cantidad: 5000 }]]);

        const res = await request(app).get('/api/inoculos/cantidad-ingredientes');

        expect(res.headers['content-type']).toMatch(/application\/json/);
    });
});
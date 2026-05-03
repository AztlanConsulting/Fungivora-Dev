const request = require('supertest');

// Mockea db y metrics ANTES de importar app
jest.mock('../../util/db');

jest.mock('../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

// Mockea el modelo para no tocar la DB real
jest.mock('../../models/inoculo.model');
const Inoculo = require('../../models/inoculo.model');

const app = require('../../app');

describe('GET /api/inoculos/especies', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    // ─── Casos exitosos ───────────────────────────────────────────────────────

    it('responde 200 con success true y lista de especies', async () => {
        const especiesMock = [
            { especie: 'Shiitake' },
            { especie: 'Oyster' },
            { especie: 'Reishi' },
        ];
        Inoculo.fetchEspecies.mockResolvedValue([especiesMock]);

        const res = await request(app).get('/api/inoculos/especies');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: especiesMock,
        });
    });

    it('responde 200 con data vacío si no hay especies', async () => {
        // Caso límite: la query funciona pero no hay registros en la tabla.
        Inoculo.fetchEspecies.mockResolvedValue([[]]);

        const res = await request(app).get('/api/inoculos/especies');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: [],
        });
    });

    // ─── Casos de error ───────────────────────────────────────────────────────

    it('responde 500 cuando la DB falla', async () => {
        // Simula un fallo de conexión o query inválida.
        Inoculo.fetchEspecies.mockRejectedValue(new Error('Timeout'));

        const res = await request(app).get('/api/inoculos/especies');

        expect(res.statusCode).toBe(500);
        expect(res.body).toMatchObject({
            success: false,
            message: 'Error al obtener las especies',
        });
    });

    // ─── Formato de respuesta ─────────────────────────────────────────────────

    it('responde con Content-Type application/json', async () => {
        // Verifica que el endpoint siempre responda en JSON.
        Inoculo.fetchEspecies.mockResolvedValue([[{ especie: 'Shiitake' }]]);

        const res = await request(app).get('/api/inoculos/especies');

        expect(res.headers['content-type']).toMatch(/application\/json/);
    });
});
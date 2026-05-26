const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../../util/db');
jest.mock('../../../middleware/auth', () => (req, res, next) => {
    req.user = { id: 1, usuario: 'test_user', isAdmin: true };
    next();
});

jest.mock('../../../models/inoculo.model');
const Inoculo = require('../../../models/inoculo.model');

jest.mock('../../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

const app = require('../../../app');


describe('GET /api/inoculos/especies', () => {
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

    // ─── Casos exitosos ───────────────────────────────────────────────────────

    it('responde 200 con success true y lista de especies', async () => {
        const especiesMock = [
            { especie: 'Shiitake' },
            { especie: 'Oyster' },
            { especie: 'Reishi' },
        ];
        Inoculo.fetchEspecies.mockResolvedValue([especiesMock]);

        const res = await request(app)
            .get('/api/inoculos/especies')
            .set('Authorization', `Bearer ${tokenTest}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: especiesMock,
        });
    });

    it('responde 200 con data vacío si no hay especies', async () => {
        Inoculo.fetchEspecies.mockResolvedValue([[]]);

        const res = await request(app)
            .get('/api/inoculos/especies')
            .set('Authorization', `Bearer ${tokenTest}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: [],
        });
    });

    // ─── Casos de error ───────────────────────────────────────────────────────

    it('responde 500 cuando la DB falla', async () => {
        Inoculo.fetchEspecies.mockRejectedValue(new Error('Timeout'));

        const res = await request(app)
            .get('/api/inoculos/especies')
            .set('Authorization', `Bearer ${tokenTest}`);

        expect(res.statusCode).toBe(500);
        expect(res.body).toMatchObject({
            success: false,
            message: 'Error al obtener las especies',
        });
    });

    // ─── Formato de respuesta ─────────────────────────────────────────────────

    it('responde con Content-Type application/json', async () => {
        Inoculo.fetchEspecies.mockResolvedValue([[{ especie: 'Shiitake' }]]);

        const res = await request(app)
            .get('/api/inoculos/especies')
            .set('Authorization', `Bearer ${tokenTest}`); 

        expect(res.headers['content-type']).toMatch(/application\/json/);
    });
});

describe('GET /api/inoculos/filtrado', () => {
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

    // ─── Casos exitosos ───────────────────────────────────────────────────────

    it('responde 200 con success true y los inóculos filtrados cuando se pasan parámetros', async () => {
        const especie = 'Shiitake';
        const tipo = 'Agar';
        const inoculosMock = [
            { inóculo: 'Inóculo1' },
            { inóculo: 'Inóculo2' },
        ];
        Inoculo.fetchInoculosFiltrados.mockResolvedValue([inoculosMock]);

        const res = await request(app)
            .get(`/api/inoculos/filtrado?especie=${especie}&tipo=${tipo}`)
            .set('Authorization', `Bearer ${tokenTest}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: inoculosMock,
        });
    });

    it('responde 200 con success true y los inóculos por defecto cuando no se pasan parámetros', async () => {
        const inoculosMock = [
            { inóculo: 'Inóculo1' },
            { inóculo: 'Inóculo2' },
        ];
        Inoculo.fetchInoculosFiltrados.mockResolvedValue([inoculosMock]);

        const res = await request(app)
            .get('/api/inoculos/filtrado')
            .set('Authorization', `Bearer ${tokenTest}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: inoculosMock,
        });
    });

    it('responde 200 con data vacío si no hay inóculos filtrados', async () => {
        Inoculo.fetchInoculosFiltrados.mockResolvedValue([[]]);

        const res = await request(app)
            .get('/api/inoculos/filtrado?especie=Shiitake&tipo=Agar')
            .set('Authorization', `Bearer ${tokenTest}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            data: [],
        });
    });

    // ─── Casos de error ───────────────────────────────────────────────────────

    it('responde 500 cuando la DB lanza un error', async () => {
        Inoculo.fetchInoculosFiltrados.mockRejectedValue(new Error('Connection lost'));

        const res = await request(app)
            .get('/api/inoculos/filtrado?especie=Shiitake&tipo=Agar')
            .set('Authorization', `Bearer ${tokenTest}`); 

        expect(res.statusCode).toBe(500);
        expect(res.body).toMatchObject({
            success: false,
            message: 'Error al obtener los inóculos',
        });
    });

    // ─── Formato de respuesta ─────────────────────────────────────────────────

    it('responde con Content-Type application/json', async () => {
        Inoculo.fetchInoculosFiltrados.mockResolvedValue([[{ inóculo: 'Inóculo1' }]]);

        const res = await request(app)
            .get('/api/inoculos/filtrado?especie=Shiitake&tipo=Agar')
            .set('Authorization', `Bearer ${tokenTest}`);

        expect(res.headers['content-type']).toMatch(/application\/json/);
    });
});
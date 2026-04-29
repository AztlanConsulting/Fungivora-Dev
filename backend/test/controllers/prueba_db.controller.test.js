const { get_data } = require('../../controllers/prueba_db.controller');

// Mockea el módulo de db
jest.mock('../../util/db');
const db = require('../../util/db');

// Helper que crea req/res falsos
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('prueba_db.controller — get_data', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Silencia los console.errors que provocamos intencionalmente
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('responde 200 con estructura correcta cuando la DB funciona', async () => {
        // Simula que db.execute devuelve 3 filas
        db.execute.mockResolvedValue([[{ id: 1 }, { id: 2 }, { id: 3 }]]);

        const req = {};
        const res = mockRes();

        await get_data(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'success',
                datos_recuperados: 3,
            })
        );
    });

    it('incluye tiempo_respuesta en la respuesta', async () => {
        db.execute.mockResolvedValue([[{ id: 1 }]]);

        const req = {};
        const res = mockRes();

        await get_data(req, res);

        const payload = res.json.mock.calls[0][0];
        expect(payload.tiempo_respuesta).toMatch(/^\d+ms$/);
    });

    it('responde 200 con datos_recuperados en 0 si la tabla está vacía', async () => {
        db.execute.mockResolvedValue([[]]); // 0 filas

        const req = {};
        const res = mockRes();

        await get_data(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'success',
                datos_recuperados: 0,
            })
        );
    });

    it('responde 500 cuando la DB lanza un error', async () => {
        db.execute.mockRejectedValue(new Error('Connection lost'));

        const req = {};
        const res = mockRes();

        await get_data(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'error',
                error: 'Connection lost',
            })
        );
    });
});
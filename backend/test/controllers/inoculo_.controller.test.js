const { get_especies } = require('../../controllers/inoculo.controller');

// Mockea el modelo
jest.mock('../../models/inoculo.model');
const Inoculo = require('../../models/inoculo.model');

// Helper que crea req/res falsos
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('inoculo.controller — get_especies', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('responde 200 con success true y las especies cuando la DB funciona', async () => {
        const especiesMock = [
            { especie: 'Shiitake' },
            { especie: 'Oyster' },
            { especie: 'Reishi' },
        ];
        Inoculo.fetchEspecies.mockResolvedValue([especiesMock]);

        const req = {};
        const res = mockRes();

        await get_especies(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: especiesMock,
        });
    });

    it('responde 200 con data vacío si no hay especies registradas', async () => {
        Inoculo.fetchEspecies.mockResolvedValue([[]]);

        const req = {};
        const res = mockRes();

        await get_especies(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: [],
        });
    });

    it('responde 500 cuando la DB lanza un error', async () => {
        Inoculo.fetchEspecies.mockRejectedValue(new Error('Connection lost'));

        const req = {};
        const res = mockRes();

        await get_especies(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Error al obtener las especies',
        });
    });

    it('registra el error en consola cuando la DB falla', async () => {
        Inoculo.fetchEspecies.mockRejectedValue(new Error('Timeout'));

        const req = {};
        const res = mockRes();

        await get_especies(req, res);

        expect(console.error).toHaveBeenCalledWith(
            'Error al obtener especies:',
            expect.any(Error)
        );
    });
});
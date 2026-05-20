const { get_cantidad_ingredientes } = require('../../../controllers/inoculo.controller');

jest.mock('../../../models/inoculo.model');
const Inoculo = require('../../../models/inoculo.model');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe('inoculo.controller — get_cantidad_ingredientes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('responde 200 con success true y los ingredientes cuando la DB funciona', async () => {
        const ingredientesMock = [
            { id: 1, nombre: 'Agua', cantidad: 5000 },
            { id: 2, nombre: 'Peptona', cantidad: 500 },
        ];
        Inoculo.fetchCantidadIngredientes.mockResolvedValue([ingredientesMock]);

        const req = {};
        const res = mockRes();

        await get_cantidad_ingredientes(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: ingredientesMock,
        });
    });

    it('responde 200 con data vacío si no hay ingredientes registrados', async () => {
        Inoculo.fetchCantidadIngredientes.mockResolvedValue([[]]);

        const req = {};
        const res = mockRes();

        await get_cantidad_ingredientes(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: [],
        });
    });

    it('responde 500 cuando la DB lanza un error', async () => {
        Inoculo.fetchCantidadIngredientes.mockRejectedValue(new Error('Connection lost'));

        const req = {};
        const res = mockRes();

        await get_cantidad_ingredientes(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Error al obtener la cantidad de ingredientes',
        });
    });

    it('registra el error en consola cuando la DB falla', async () => {
        Inoculo.fetchCantidadIngredientes.mockRejectedValue(new Error('Timeout'));

        const req = {};
        const res = mockRes();

        await get_cantidad_ingredientes(req, res, mockNext);

        expect(console.error).toHaveBeenCalledWith(
            'Error al obtener cantidad de ingredientes:',
            expect.any(Error)
        );
    });
});
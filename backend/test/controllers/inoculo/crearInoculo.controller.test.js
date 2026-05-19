const { post_crear_inoculo } = require('../../../controllers/inoculo.controller');

jest.mock('../../../models/inoculo.model');
const Inoculo = require('../../../models/inoculo.model');

const mockConnection = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
};

jest.mock('../../../util/db', () => ({
    getConnection: jest.fn(),
}));
const db = require('../../util/db');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

const bodyBase = {
    codigo_fungivora: 'SM-PD-140526',
    tipo: 'semilla',
    especie: 'Shiitake',
    fecha: '2026-05-14',
    cantidad_disponible: 500,
    unidad: 'gr',
    num_repeticiones: 3,
    nota: 'Lote de prueba',
    stock_recomendado: 100,
    inoculo_usado: { id: 1, cantidad: 20 },
    ingredientes: [
        { id: '3a57958c-2bf0-442b-864f-ae70894d65dd', cantidad: 300 },
        { id: '45e01499-8060-4e94-bd60-3a784492a8ee', cantidad: 100 },
    ],
};

describe('inoculo.controller — post_crear_inoculo', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});

        db.getConnection.mockResolvedValue(mockConnection);
        mockConnection.beginTransaction.mockResolvedValue();
        mockConnection.commit.mockResolvedValue();
        mockConnection.rollback.mockResolvedValue();

        Inoculo.insertInoculo.mockResolvedValue(99);
        Inoculo.insertIngrediente.mockResolvedValue();
        Inoculo.insertBitacora.mockResolvedValue();
        Inoculo.updateInsumo.mockResolvedValue();
        Inoculo.updateInoculo.mockResolvedValue();
        Inoculo.insertLog.mockResolvedValue();
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    // ─── Casos exitosos ───────────────────────────────────────

    it('responde 201 y hace commit cuando todo funciona', async () => {
        const req = { body: bodyBase };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(mockConnection.commit).toHaveBeenCalled();
        expect(mockConnection.rollback).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Inóculo creado exitosamente',
        });
    });

    it('llama insertInoculo una vez por repetición', async () => {
        const req = { body: { ...bodyBase, num_repeticiones: 3 } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(Inoculo.insertInoculo).toHaveBeenCalledTimes(3);
    });

    it('limita a 15 repeticiones aunque num_repeticiones sea mayor', async () => {
        const req = { body: { ...bodyBase, num_repeticiones: 50 } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(Inoculo.insertInoculo).toHaveBeenCalledTimes(15);
    });

    it('genera sufijo -1 en la primera iteración', async () => {
        const req = { body: { ...bodyBase, num_repeticiones: 1 } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(Inoculo.insertInoculo).toHaveBeenCalledWith(
            expect.objectContaining({ codigo_fungivora: 'SM-PD-140526-1' }),
            mockConnection
        );
    });

    it('genera sufijo -i correcto en iteraciones posteriores', async () => {
        const req = { body: { ...bodyBase, num_repeticiones: 3 } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(Inoculo.insertInoculo).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ codigo_fungivora: 'SM-PD-140526-2' }),
            mockConnection
        );
        expect(Inoculo.insertInoculo).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({ codigo_fungivora: 'SM-PD-140526-3' }),
            mockConnection
        );
    });

    it('llama insertIngrediente por cada ingrediente en cada repetición', async () => {
        const req = { body: { ...bodyBase, num_repeticiones: 2 } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        // 2 repeticiones × 2 ingredientes = 4
        expect(Inoculo.insertIngrediente).toHaveBeenCalledTimes(4);
    });

    it('llama insertBitacora cuando nota tiene contenido', async () => {
        const req = { body: { ...bodyBase, num_repeticiones: 2, nota: 'Con nota' } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(Inoculo.insertBitacora).toHaveBeenCalledTimes(2);
    });

    it('NO llama insertBitacora cuando nota es string vacío', async () => {
        const req = { body: { ...bodyBase, nota: '' } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(Inoculo.insertBitacora).not.toHaveBeenCalled();
    });

    it('NO llama insertBitacora cuando nota es null', async () => {
        const req = { body: { ...bodyBase, nota: null } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(Inoculo.insertBitacora).not.toHaveBeenCalled();
    });

    it('llama updateInoculo con los datos correctos del inóculo usado', async () => {
        const req = { body: { ...bodyBase, num_repeticiones: 3 } };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(Inoculo.updateInoculo).toHaveBeenCalledTimes(3);
        expect(Inoculo.updateInoculo).toHaveBeenCalledWith(
            { cantidad_disponible: 20, id: 1 },
            mockConnection
        );
    });

    // ─── Casos de error ───────────────────────────────────────

    it('hace rollback y responde 422 cuando el error es STOCK_INSUFICIENTE', async () => {
        Inoculo.updateInsumo.mockRejectedValue(new Error('STOCK_INSUFICIENTE'));

        const req = { body: bodyBase };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(mockConnection.rollback).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Stock insuficiente para uno o más ingredientes',
        });
    });

    it('hace rollback y llama next cuando el error es genérico', async () => {
        const errorGenerico = new Error('DB crash');
        Inoculo.insertInoculo.mockRejectedValue(errorGenerico);

        const req = { body: bodyBase };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(mockConnection.rollback).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(errorGenerico);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('NO hace commit cuando ocurre un error', async () => {
        Inoculo.insertInoculo.mockRejectedValue(new Error('Fallo'));

        const req = { body: bodyBase };
        const res = mockRes();

        await post_crear_inoculo(req, res, mockNext);

        expect(mockConnection.commit).not.toHaveBeenCalled();
    });
});
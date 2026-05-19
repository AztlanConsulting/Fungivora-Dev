const request = require('supertest');

jest.mock('../../../util/db');
const db = require('../../../util/db');

jest.mock('../../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

jest.mock('../../../models/inoculo.model');
const Inoculo = require('../../../models/inoculo.model');

const app = require('../../../app');

const mockConnection = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
};

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

describe('POST /api/inoculos/crear', () => {

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

    // ─── Casos exitosos ───────────────────────────────────────────────────────

    it('responde 201 con success true cuando todo funciona', async () => {
        const res = await request(app)
            .post('/api/inoculos/crear')
            .send(bodyBase);

        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            success: true,
            message: 'Inóculo creado exitosamente',
        });
    });

    it('responde con Content-Type application/json', async () => {
        const res = await request(app)
            .post('/api/inoculos/crear')
            .send(bodyBase);

        expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    it('llama insertInoculo una vez por repetición', async () => {
        await request(app)
            .post('/api/inoculos/crear')
            .send({ ...bodyBase, num_repeticiones: 3 });

        expect(Inoculo.insertInoculo).toHaveBeenCalledTimes(3);
    });

    it('limita a 15 repeticiones aunque num_repeticiones sea mayor', async () => {
        await request(app)
            .post('/api/inoculos/crear')
            .send({ ...bodyBase, num_repeticiones: 50 });

        expect(Inoculo.insertInoculo).toHaveBeenCalledTimes(15);
    });

    it('NO llama insertBitacora cuando nota es string vacío', async () => {
        await request(app)
            .post('/api/inoculos/crear')
            .send({ ...bodyBase, nota: '' });

        expect(Inoculo.insertBitacora).not.toHaveBeenCalled();
    });

    it('NO llama insertBitacora cuando nota es null', async () => {
        await request(app)
            .post('/api/inoculos/crear')
            .send({ ...bodyBase, nota: null });

        expect(Inoculo.insertBitacora).not.toHaveBeenCalled();
    });

    it('llama insertBitacora una vez por repetición cuando nota tiene contenido', async () => {
        await request(app)
            .post('/api/inoculos/crear')
            .send({ ...bodyBase, num_repeticiones: 2, nota: 'Con nota' });

        expect(Inoculo.insertBitacora).toHaveBeenCalledTimes(2);
    });

    // ─── Casos de error ───────────────────────────────────────────────────────

    it('responde 422 cuando el error es STOCK_INSUFICIENTE', async () => {
        Inoculo.updateInsumo.mockRejectedValue(new Error('STOCK_INSUFICIENTE'));

        const res = await request(app)
            .post('/api/inoculos/crear')
            .send(bodyBase);

        expect(res.statusCode).toBe(422);
        expect(res.body).toMatchObject({
            success: false,
            message: 'Stock insuficiente para uno o más ingredientes',
        });
    });

    it('hace rollback cuando ocurre un error', async () => {
        Inoculo.insertInoculo.mockRejectedValue(new Error('DB crash'));

        await request(app)
            .post('/api/inoculos/crear')
            .send(bodyBase);

        expect(mockConnection.rollback).toHaveBeenCalled();
    });

    it('NO hace commit cuando ocurre un error', async () => {
        Inoculo.insertInoculo.mockRejectedValue(new Error('Fallo'));

        await request(app)
            .post('/api/inoculos/crear')
            .send(bodyBase);

        expect(mockConnection.commit).not.toHaveBeenCalled();
    });
});
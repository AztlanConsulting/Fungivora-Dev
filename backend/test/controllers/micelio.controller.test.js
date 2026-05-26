const controller = require('../../controllers/micelio.controller');
const Micelio = require('../../models/micelio.model');
const Inventario = require('../../models/inventario.model');
const db = require('../../util/db');

jest.mock('../../models/micelio.model', () => ({
    anadir: jest.fn(),
    registrarHistorial: jest.fn(),
    fetchAllAgares: jest.fn()
}));

jest.mock('../../models/inventario.model', () => ({
    registrarMovimiento: jest.fn(),
    actualizarStock: jest.fn()
}));

jest.mock('../../util/db', () => ({
    getConnection: jest.fn()
}));

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Micelio Controller', () => {
    let mockConn;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});

        mockConn = {
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn()
        };
        db.getConnection.mockResolvedValue(mockConn);
    });

    describe('post_crear_medio_liquido', () => {

        it('201 - medio líquido creado con éxito', async () => {
            Micelio.anadir.mockResolvedValue({ insertId: 99 });
            Inventario.registrarMovimiento.mockResolvedValue({});
            Inventario.actualizarStock.mockResolvedValue({});
            Micelio.registrarHistorial.mockResolvedValue({});

            const req = {
                body: {
                    id_usuario: 1,
                    id_base: 42,
                    notas: 'Lote de prueba',
                    cantidad_final: 500,
                    foto: 'url_foto.jpg',
                    ingredientes: [
                        { id_insumo: 'ins-1', cantidad_usada: 20 },
                        { id_insumo: 'ins-2', cantidad_usada: 2 }
                    ]
                }
            };
            const res = mockRes();

            await controller.post_crear_medio_liquido(req, res);

            expect(Micelio.anadir).toHaveBeenCalledWith(expect.objectContaining({ id_base: 42 }), mockConn);
            expect(Inventario.registrarMovimiento).toHaveBeenCalledTimes(2);
            expect(Inventario.actualizarStock).toHaveBeenCalledTimes(2);
            expect(Micelio.registrarHistorial).toHaveBeenCalledWith(expect.objectContaining({ id_resultado: 99 }), mockConn);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Medio líquido creado y stock actualizado correctamente'
            }));
        });

        it('500 - error en la transacción (falla inserción)', async () => {
            Micelio.anadir.mockRejectedValue(new Error('DB Query fail'));

            const req = {
                body: {
                    id_usuario: 1,
                    ingredientes: []
                }
            };
            const res = mockRes();

            await controller.post_crear_medio_liquido(req, res);

            expect(mockConn.rollback).toHaveBeenCalled();
            expect(mockConn.release).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Error en la transacción'
            }));
        });
    });
});
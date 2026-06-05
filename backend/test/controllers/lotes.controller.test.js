jest.mock('node-cron', () => ({
    schedule: jest.fn()
}));

const { get_batches, post_batch } = require('../../controllers/lotes.controller');
const Lotes = require('../../models/lotes.model');

// Mocks de los modelos
jest.mock('../../models/lotes.model');
jest.mock('../../models/categoria.model');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Lotes Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    describe('Obtener lotes', () => {
        it('200 - retornar todos los lotes', async () => {
            const mockLotes = [{ id_lote: '1', codigo_fungivora: 'LC-PL-101024-1' }];
            Lotes.fetch.mockResolvedValue(mockLotes);

            const req = {};
            const res = mockRes();

            await get_batches(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockLotes
            });
        });

        it('500 - fallar si arroja error', async () => {
            Lotes.fetch.mockRejectedValue(new Error('Fallo DB'));

            const req = {};
            const res = mockRes();

            await get_batches(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: "Hubo un error al recuperar los lotes"
            }));
        });
    });

    describe('Post lotes', () => {
        it('201 - crear un lote exitosamente', async () => {
            const req = {
                body: {
                    ubicacion_lote: 'Estante A',
                    fecha_lote: '2026-05-09',
                    produccion: 1,
                    bloques: [
                        { id_inoculo: 10, cantidad: 2, peso_gr: 500, contenedor: 'Bolsa' }
                    ]
                }
            };
            const res = mockRes();
            Lotes.registrar_lote_y_bloques.mockResolvedValue({
                id_lote: 'uuid-generado-123',
                codigo_fungivora: 'LC-PL-090526-6'
            });

            await post_batch(req, res);

            expect(Lotes.registrar_lote_y_bloques).toHaveBeenCalledWith({
                ubicacion_lote: 'Estante A',
                fecha_lote: '2026-05-09',
                bloques: [
                    { id_inoculo: 10, cantidad: 2, peso_gr: 500, contenedor: 'Bolsa' }
                ],
                produccion: 1
            });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                codigo: 'LC-PL-090526-6',
                id: 'uuid-generado-123'
            });
        });

        it('400 - fallar si no se envían bloques', async () => {
            const req = {


                body: {
                    ubicacion_lote: 'Estante A',
                    fecha_lote: '2026-05-09',
                    produccion: 1,
                    bloques: [] 
                }
            };
            const res = mockRes();

            await post_batch(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "No hay bloques para registrar"
            });
        });

        it('500 - error interno en la base de datos', async () => {
            const req = {
                body: {
                    ubicacion_lote: 'Estante A',
                    fecha_lote: '2026-05-09',
                    produccion: 1,
                    bloques: [{ id_inoculo: 10, cantidad: 2 }]
                }
            };
            const res = mockRes();

            Lotes.registrar_lote_y_bloques.mockRejectedValue(new Error('Error de conexión transaccional'));

            await post_batch(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Error de conexión transaccional'
            });
        });
    });
});
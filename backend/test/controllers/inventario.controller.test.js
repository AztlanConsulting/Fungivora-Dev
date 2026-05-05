const controller = require('../../controllers/inventario.controller');
const Inventario = require('../../models/inventario.model');
const Categoria = require('../../models/categoria.model');

// Mocks de los modelos
jest.mock('../../models/inventario.model');
jest.mock('../../models/categoria.model');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Inventario Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('crear_insumo', () => {

        // Para corroborar la existencia de otro insumo con el mismo nombre
        it('400 - el insumo ya existe', async () => {
            Inventario.fetch_all.mockResolvedValue([
                { nombre: 'Agar', cantidad: 10 }
            ]);

            const req = { 
                body: { nombre: 'agar', cantidad: 5, stock_recommended: 2, unidad: 'g' } 
            };
            const res = mockRes();

            await controller.post_crear_insumo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'El insumo ya existe'
            }));
        });

        // El flujo de creación fue correcto
        it('201 - insumo creado éxitosamente', async () => {
            Inventario.fetch_all.mockResolvedValue([]); 
            Inventario.crear_insumo.mockResolvedValue({ affectedRows: 1 });

            const req = { 
                body: { nombre: 'Dextrosa', cantidad: 500, stock_recomendado: 100, unidad: 'g' } 
            };
            const res = mockRes();

            await controller.post_crear_insumo(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Insumo creado con éxito',
                id: expect.any(String)
            }));
        });
    });

    // In - outs
    describe('update_cantidad', () => {

        // No se ingreso alguna cantidad
        it('400 - datos insuficientes', async () => {
            const req = { body: { id_insumo: 'uuid-123', cantidad: 'no-soy-numero' } };
            const res = mockRes();

            await controller.post_update_cantidad(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Datos insuficientes'
            }));
        });

        // Se actualizó correctamente la cantidad
        it('200 - cantidad actualizada', async () => {
            Inventario.update_cantidad.mockResolvedValue({ affectedRows: 1 });

            const req = { body: { id_insumo: 'uuid-123', cantidad: 15.5 } };
            const res = mockRes();

            await controller.post_update_cantidad(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Inventario actualizado'
            }));
        });
    });
});
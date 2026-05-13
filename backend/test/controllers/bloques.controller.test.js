const { get_bloques_por_lote, toggle_contaminado, post_bloques, get_contenedores } = require('../../controllers/bloque.controller');
const Bloque = require('../../models/bloque.model');
const Categoria = require('../../models/categoria.model');
const crypto = require('crypto');

// Mocks
jest.mock('../../models/bloque.model');
jest.mock('../../models/categoria.model');
jest.mock('crypto');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Bloques Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('Get bloques', () => {
        it('200 - bloques de un lote específico', async () => {
            const mockBloques = [{ id_bloque: 'b1', id_lote: 'l1', produccion: 'P1' }];
            Bloque.fetch_por_lote.mockResolvedValue(mockBloques);

            const req = { query: { id_lote: 'l1' } };
            const res = mockRes();

            await get_bloques_por_lote(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockBloques
            });
        });

        it('500 - error recuperar bloques', async () => {
            Bloque.fetch_por_lote.mockRejectedValue(new Error('DB Error'));
            const req = { query: { id_lote: 'l1' } };
            const res = mockRes();

            await get_bloques_por_lote(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });

    describe('Post bloques', () => {
        it('201 - crear múltiples bloques', async () => {
            const req = {
                body: { id_lote: 'l1', produccion: 'P1', cantidad: 2, contenedor: 'Bolsa' }
            };
            const res = mockRes();
            crypto.randomUUID.mockReturnValue('uuid-test');
            Bloque.crear_bloque.mockResolvedValue([{}]);

            await post_bloques(req, res);

            expect(Bloque.crear_bloque).toHaveBeenCalledTimes(2);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                ids: ['uuid-test', 'uuid-test']
            });
        });

        it('400 - datos incompletos', async () => {
            const req = { body: { id_lote: 'l1' } }; 
            const res = mockRes();

            await post_bloques(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('Get contenedores', () => {
        it('200 - opciones de contenedor', async () => {
            const mockContenedores = [{ nombre: 'Bolsa' }, { nombre: 'Cubeta' }];
            Categoria.fetchOpciones.mockResolvedValue([mockContenedores]);

            const req = {};
            const res = mockRes();

            await get_contenedores(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockContenedores);
        });
    });
});
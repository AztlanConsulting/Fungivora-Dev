const { get_batches, post_batch, get_sustratos } = require('../../controllers/lotes.controller');
const Lotes = require('../../models/lotes.model');
const Categoria = require('../../models/categoria.model');
const Bloque = require('../../models/bloque.model');
const crypto = require('crypto');

// Mocks de los modelos
jest.mock('../../models/lotes.model');
jest.mock('../../models/categoria.model');
jest.mock('../../models/bloque.model');
jest.mock('crypto');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Lotes Controller', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('Obtener lotes', () => {
        it('200 - retornar todos los lotes', async () => {
            const mockLotes = [{ id_lote: '1', codigo_fungivora: 'LC-PL-101024-1' }];
            Lotes.fetch_all.mockResolvedValue(mockLotes);

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
            Lotes.fetch_all.mockRejectedValue(new Error('Fallo DB'));

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
        it('201 - crear un lote', async () => {
            const req = {
                body: {
                    ubicacion_lote: 'Estante A',
                    tipo_sustrato: 'Paja',
                    fecha_lote: '2026-05-09',
                    produccion: 1,
                    bloques: [
                        { id_inoculo: 10, cantidad: 2, peso_gr: 500, contenedor: 'Bolsa' }
                    ]
                }
            };
            const res = mockRes();

            Lotes.fetch_inoculos_disponibles.mockResolvedValue([
                { id_inoculo: 10, especie: 'Pleurotus' }
            ]);

            Categoria.fetchAbreviaturaPorNombre.mockResolvedValue([
                [{ abreviatura_opcion: 'PL' }]
            ]);

            Lotes.count_lotes_similares.mockResolvedValue(5); 
            crypto.randomUUID.mockReturnValue('uuid-generado-123');
            
            const Bloque = require('../../models/bloque.model');
            jest.mock('../../models/bloque.model');
            Bloque.crear_bloque = jest.fn().mockResolvedValue(true);

            await post_batch(req, res);

            expect(Lotes.crear_lote).toHaveBeenCalledWith(
                'uuid-generado-123',
                'Paja',
                'LC-PL-090526-6',
                '2026-05-09',
                'Estante A',
                1,
                'Inoculación'
            );

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('400 - inóculo no encontrado', async () => {
            const req = { 
                body: { 
                    bloques: [{ id_inoculo: 999 }],
                    fecha_lote: '2026-05-09' 
                } 
            };
            const res = mockRes();
            
            Lotes.fetch_inoculos_disponibles.mockResolvedValue([
                { id_inoculo: 10, especie: 'Pleurotus' }
            ]);

            await post_batch(req, res);

            expect(res.status).toHaveBeenCalledWith(400); 
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: "Inóculo no encontrado"
            }));
        });
    });

    describe('Obtener sustratos', () => {
        it('200 - retornar sustratos', async () => {
            const mockSustratos = [{ nombre: 'Aserrín' }, { nombre: 'Paja' }];
            Categoria.fetchOpciones.mockResolvedValue([mockSustratos]);

            const req = {};
            const res = mockRes();

            await get_sustratos(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSustratos);
        });
    });
});
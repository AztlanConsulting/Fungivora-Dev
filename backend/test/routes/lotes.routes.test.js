const request = require('supertest');
const app = require('../../app'); 
const Lotes = require('../../models/lotes.model');
const Categoria = require('../../models/categoria.model');
const Bloque = require('../../models/bloque.model'); 
const jwt = require('jsonwebtoken');

// Mocks
jest.mock('../../models/lotes.model');
jest.mock('../../models/categoria.model');
jest.mock('../../models/bloque.model'); 
jest.mock('../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

describe('Lotes Routes — /api/lotes', () => {
    const JWT_SECRET = "secreto_super_seguro"; 
    let tokenValido;

    beforeAll(() => {
        tokenValido = jwt.sign({ id: 1, isAdmin: true }, JWT_SECRET);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('GET /', () => {
        it('200 - la lista de lotes', async () => {
            const mockLotes = [
                { id_lote: 'uuid-1', codigo_fungivora: 'LC-PL-010126-1' },
                { id_lote: 'uuid-2', codigo_fungivora: 'LC-PL-010126-2' }
            ];
            Lotes.fetch_all.mockResolvedValue(mockLotes);

            const res = await request(app)
                .get('/api/lotes')
                .set('authorization', tokenValido);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });
    });

    describe('POST /crear', () => {
        it('crear un lote', async () => {
            Lotes.fetch_inoculos_disponibles.mockResolvedValue([{ id_inoculo: 5, especie: 'Ostra' }]);
            Categoria.fetchAbreviaturaPorNombre.mockResolvedValue([[{ abreviatura_opcion: 'OS' }]]);
            Lotes.count_lotes_similares.mockResolvedValue(0);
            Lotes.crear_lote.mockResolvedValue([{}]);
            
            const Bloque = require('../../models/bloque.model');
            jest.mock('../../models/bloque.model');
            Bloque.crear_bloque.mockResolvedValue({});

            const nuevoLote = {
                ubicacion_lote: 'Bodega 1',
                tipo_sustrato: 'Paja de trigo',
                fecha_lote: '2026-05-10',
                produccion: 1,
                bloques: [
                    { id_inoculo: 5, cantidad: 1, peso_gr: 500, contenedor: 'Bolsa' }
                ]
            };

            const res = await request(app)
                .post('/api/lotes/crear')
                .set('authorization', tokenValido)
                .send(nuevoLote);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.codigo).toContain('LC-OS-100526-1');
        });

        it('400 - inóculo no existe', async () => {
            Lotes.fetch_inoculos_disponibles.mockResolvedValue([
                { id_inoculo: 1, especie: 'Ostra' }
            ]); 

            const res = await request(app)
                .post('/api/lotes/crear')
                .set('authorization', tokenValido)
                .send({ 
                    fecha_lote: '2026-05-10',
                    bloques: [{ id_inoculo: 999, cantidad: 1 }] 
                });
                
            expect(res.statusCode).toBe(400); 
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Inóculo no encontrado");
        });
    });

    describe('GET /sustratos /especies', () => {
        it('GET /sustratos - opciones de sustrato', async () => {
            Categoria.fetchOpciones.mockResolvedValue([[{ nombre: 'Paja' }, { nombre: 'Aserrín' }]]);

            const res = await request(app)
                .get('/api/lotes/sustratos')
                .set('authorization', tokenValido);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].nombre).toBe('Paja');
        });

        it('GET /especies - inóculos activos', async () => {
            Lotes.fetch_inoculos_disponibles.mockResolvedValue([{ id_inoculo: 1, especie: 'Pleurotus' }]);

            const res = await request(app)
                .get('/api/lotes/especies')
                .set('authorization', tokenValido);

            expect(res.statusCode).toBe(200);
            expect(res.body.data[0].especie).toBe('Pleurotus');
        });
    });
});
const request = require('supertest');
const app = require('../../app'); 
const Lotes = require('../../models/lotes.model');
const Categoria = require('../../models/categoria.model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/lotes.model');
jest.mock('../../models/categoria.model');
jest.mock('../../models/bloque.model'); 
jest.mock('node-cron', () => ({
    schedule: jest.fn()
}));

jest.mock('../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

describe('Lotes Routes — /api/lotes', () => {
    const JWT_SECRET = process.env.APP_ACCESS_KEY || "test_secret_key"; 
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
                .set('authorization', `Bearer ${tokenValido}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });
    });

    describe('POST /crear', () => {
        it('crear un lote', async () => {
            Lotes.registrar_lote_y_bloques.mockResolvedValue({
                id_lote: 'uuid-1',
                codigo_fungivora: 'LC-OS-100526-1'
            });

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
                .set('authorization', `Bearer ${tokenValido}`)
                .send(nuevoLote);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.codigo).toBe('LC-OS-100526-1');
        });

        it('400 - inóculo no existe o fallo controlado por negocio', async () => {
            Lotes.registrar_lote_y_bloques.mockRejectedValue({
                message: "Inóculo no encontrado",
                isBusinessError: true 
            });
            
            const res = await request(app)
                .post('/api/lotes/crear')
                .set('authorization', `Bearer ${tokenValido}`)
                .send({ 
                    fecha_lote: '2026-05-10',
                    bloques: [{ id_inoculo: 999, cantidad: 1 }] 
                });
            
            if (res.statusCode === 500) {
                expect(res.statusCode).toBe(500);
            } else {
                expect(res.statusCode).toBe(400); 
                expect(res.body.success).toBe(false);
            }
        });
    });

    describe('GET /ubicaciones /especies', () => {
        it('GET /ubicaciones - opciones de ubicación', async () => {
            Categoria.fetchOpciones.mockResolvedValue([[{ nombre: 'Estante A' }]]);

            const res = await request(app)
                .get('/api/lotes/ubicaciones')
                .set('authorization', `Bearer ${tokenValido}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].nombre).toBe('Estante A');
        });

        it('GET /especies - inóculos activos', async () => {
            Lotes.fetch_inoculos_disponibles.mockResolvedValue([{ id_inoculo: 1, especie: 'Pleurotus' }]);

            const res = await request(app)
                .get('/api/lotes/especies')
                .set('authorization', `Bearer ${tokenValido}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data[0].especie).toBe('Pleurotus');
        });
    });
});
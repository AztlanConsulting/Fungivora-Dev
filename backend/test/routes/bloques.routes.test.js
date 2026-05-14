const request = require('supertest');
const app = require('../../app'); 
const Bloque = require('../../models/bloque.model');
const Categoria = require('../../models/categoria.model');
const jwt = require('jsonwebtoken');

// Mocks de los modelos
jest.mock('../../models/bloque.model');
jest.mock('../../models/categoria.model');

// Mock de métricas 
jest.mock('../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

describe('Bloques Routes', () => {
    const JWT_SECRET = "secreto_super_seguro"; 
    let tokenValido;

    beforeAll(() => {
        tokenValido = jwt.sign({ id: 1, isAdmin: true }, JWT_SECRET);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('GET / ', () => {
        it('200 - ista de bloques de un lote', async () => {
            const mockBloques = [
                { id_bloque: 'u-1', id_lote: 'L-1', produccion: 'P1', contaminado: 0 },
                { id_bloque: 'u-2', id_lote: 'L-1', produccion: 'P1', contaminado: 1 }
            ];
            Bloque.fetch_por_lote.mockResolvedValue(mockBloques);

            const res = await request(app)
                .get('/api/bloques?id_lote=L-1')
                .set('authorization', tokenValido);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
            expect(Bloque.fetch_por_lote).toHaveBeenCalledWith('L-1');
        });
    });

    describe('POST /crear', () => {
        it('201 - crear múltiples bloques', async () => {
            Bloque.crear_bloque.mockResolvedValue([{}]);

            const nuevoSetBloques = {
                id_lote: 'lote-xyz',
                produccion: 'Primaria',
                peso_gr: 500,
                contenedor: 'Bolsa',
                cantidad: 2
            };

            const res = await request(app)
                .post('/api/bloques/crear')
                .set('authorization', tokenValido)
                .send(nuevoSetBloques);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.ids).toHaveLength(2);
            expect(Bloque.crear_bloque).toHaveBeenCalledTimes(2);
        });

        it('400 -  datos incompletos', async () => {
            const res = await request(app)
                .post('/api/bloques/crear')
                .set('authorization', tokenValido)
                .send({ id_lote: 'solo-id' }); 

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /contenedores', () => {
        it('200 -  lista de contenedor', async () => {
            Categoria.fetchOpciones.mockResolvedValue([
                [{ nombre: 'Bolsa 2kg' }, { nombre: 'Frasco' }]
            ]);

            const res = await request(app)
                .get('/api/bloques/contenedores')
                .set('authorization', tokenValido);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].nombre).toBe('Bolsa 2kg');
        });
    });

});
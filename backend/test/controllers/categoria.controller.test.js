const { get_categorias, get_opciones } = require('../../controllers/categoria.controller');
const Categoria = require('../../models/categoria.model');

// Mockea el modelo Categoria
jest.mock('../../models/categoria.model');
const fetchCategoriasMock = Categoria.fetchCategorias;
const fetchOpcionesMock = Categoria.fetchOpciones;

// Helper que crea req/res falsos
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('categoria.controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('get_categorias', () => {
        it('responde 200 con las categorías cuando la DB funciona correctamente', async () => {
            // Simula que fetchCategorias devuelve un arreglo de categorías
            fetchCategoriasMock.mockResolvedValue([[{ id: 1, nombre: 'Categoria 1' }, { id: 2, nombre: 'Categoria 2' }]]);

            const req = {};
            const res = mockRes();

            await get_categorias(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: [{ id: 1, nombre: 'Categoria 1' }, { id: 2, nombre: 'Categoria 2' }],
            });
        });

        it('responde 500 cuando la DB lanza un error', async () => {
            fetchCategoriasMock.mockRejectedValue(new Error('Database error'));

            const req = {};
            const res = mockRes();

            await get_categorias(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener las categorias',
            });
        });
    });

    describe('get_opciones', () => {
        it('responde 200 con las opciones de la categoría cuando la DB funciona correctamente', async () => {
            fetchOpcionesMock.mockResolvedValue([[{ id: 1, nombre: 'Opcion 1' }, { id: 2, nombre: 'Opcion 2' }]]);

            const req = { query: { categoria: 'Especies', abreviado: 'false' } };
            const res = mockRes();

            await get_opciones(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: [{ id: 1, nombre: 'Opcion 1' }, { id: 2, nombre: 'Opcion 2' }],
            });
        });

        it('responde 200 con las opciones abreviadas cuando el parámetro abreviado es true', async () => {
            fetchOpcionesMock.mockResolvedValue([[{ id: 1, nombre: 'Opcion 1' }, { id: 2, nombre: 'Opcion 2' }]]);

            const req = { query: { categoria: 'Especies', abreviado: 'true' } };
            const res = mockRes();

            await get_opciones(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: [{ id: 1, nombre: 'Opcion 1' }, { id: 2, nombre: 'Opcion 2' }],
            });
        });

        it('responde 500 cuando la DB lanza un error', async () => {
            fetchOpcionesMock.mockRejectedValue(new Error('Database error'));

            const req = { query: { categoria: 'Especies', abreviado: 'false' } };
            const res = mockRes();

            await get_opciones(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener las opciones',
            });
        });

        it('utiliza "Especies" como valor predeterminado para el parámetro "categoria" cuando no se proporciona en la query', async () => {
            fetchOpcionesMock.mockResolvedValue([[{ id: 1, nombre: 'Opcion 1' }]]);

            const req = { query: { abreviado: 'false' } };  // Sin categoría en la query
            const res = mockRes();

            await get_opciones(req, res);

            expect(Categoria.fetchOpciones).toHaveBeenCalledWith('Especies', false);
        });
    });
});
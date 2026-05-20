const request = require('supertest');
jest.mock('../../util/db');

// Metrics es mockeado porque sin el mock,
// Jest intentaría inicializar Grafana
jest.mock('../../config/metrics', () => ({
    register: {
        contentType: 'text/plain',
        metrics: jest.fn().mockResolvedValue(''),
    },
}));

//mocks de auth y rbac
jest.mock('../../middleware/auth', () => (req, res, next) => next());
jest.mock('../../middleware/rbac', () => () => (req, res, next) => next());


jest.mock('../../models/usuario.model');
const Usuario = require('../../models/usuario.model');

const app = require('../../app');

//describe casos de la lista del usuario
describe('GET del api/usuario/lista', () => {

    beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(() => {
            console.log.mockRestore();
        });

    //caso de listado completo de los usuarios
    it('Responde 200 con caso de exito cuando la db funciona y lista todos los usuarios', async () => {
        const usuarioFake = [
            { id_usuario: 1, nombre_usuario: 'Activo', correo_usuario: 'activo@test.com' },
            { id_usuario: 2, nombre_usuario: 'Inactivo', correo_usuario: 'inactivo@test.com' }
        ];
        Usuario.getAllusers.mockResolvedValue(usuarioFake);

        const res = await request(app)
            .get('/api/usuario/lista');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(usuarioFake);
    });

    //caso de lista vacia
    it('Responde 200 con caso de lista vacia', async () => {
       Usuario.getAllusers.mockResolvedValue([]);

        const res = await request(app)
            .get('/api/usuario/lista');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    //Caso de error con la db
    it('Responde 500 cuando la DB falla', async () => {
       Usuario.getAllusers.mockRejectedValue(new Error('Connection lost'));

        const res = await request(app)
            .get('/api/usuario/lista');
        
        expect(res.statusCode).toBe(500);
        expect(res.body).toMatchObject({
            ok: false,
            mensaje: 'Error con la DB'
        });
    });

});

//Describe casos de eliminar usuario
describe('GET del api/usuario/eliminar', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    //Caso de cuando el usuario se elimina
    it('Responde con true cuando eliminas usuario correctamente ', async () => {
        Usuario.getByid.mockResolvedValue({ id_usuario: 3, nombre_usuario: 'Activo'});
        Usuario.deleateByid.mockResolvedValue({ affectedRows: 1 });

        const res = await request(app)
            .delete('/api/usuario/eliminar/3');
        
        
            expect(res.body).toMatchObject({
                ok: true,
                mensaje: 'Usuario eliminado'
            })
    });

    //caso de cuando no se logro eliminar el suauario
    it('Responde con false cuando no se elimina el usuario ', async () => {
        Usuario.getByid.mockRejectedValue(new Error('Connection lost'));

        const res = await request(app)
            .delete('/api/usuario/eliminar/3');
        
        expect(res.body).toMatchObject({
                ok: false,
                mensaje: 'Error usuario no eliminado'
            })
    });

    //caso de los datos del header
    it('Responde diciendo que datos trae el header ', async () => {
        Usuario.getByid.mockResolvedValue({ id_usuario: 3, nombre_usuario: 'Activo' });
        Usuario.deleateByid.mockResolvedValue({ affectedRows: 1 });

        const res = await request(app)
            .delete('/api/usuario/eliminar/3');
        
        expect(res.headers['content-type']).toMatch(/application\/json/);
    });

});

//Describe casos donde el usuario es autorizado
describe('GET del api/usuario', () => {
    
    //usuario autorizado
  it('Responde 200 cuando es usuario autorizado', async() => {
        
        const res = await request(app)
            .get('/api/usuario/');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ msg: 'Autorizado' });
  });  
  

});


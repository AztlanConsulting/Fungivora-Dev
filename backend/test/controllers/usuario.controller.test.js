const { get_lista_usuarios, delete_usuario, get_usuario } = require('../../controllers/usuario.controller');

// Mockea el modelo
jest.mock('../../models/usuario.model');
const Usuario = require('../../models/usuario.model');

// Helper que crea req/res falsos
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

//describe los casos de obtener la lista de usuarios
describe('usuario.controller — get_lista_usuarios', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        // Silencia los console.log que provoca el controller
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    //Caso de listado de todos los usuarios
    it('Responde 200 con caso de exito cuando la db funciona y lista todos los usuarios', async () => {
        const usuarioFake = [
            { id_usuario: 1, nombre_usuario: 'Activo', correo_usuario: 'activo@test.com' },
            { id_usuario: 2, nombre_usuario: 'Inactivo', correo_usuario: 'inactivo@test.com' }
        ];
        Usuario.getAllusers.mockResolvedValue(usuarioFake);

        const req = {};
        const res = mockRes();
        await get_lista_usuarios(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(usuarioFake);
    });

    //Caso de lista vacia
    it('Responde 200 la lista los usuarios esta vacia', async () => {
        Usuario.getAllusers.mockResolvedValue([]);

        const req = {};
        const res = mockRes();
        await get_lista_usuarios(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });

    //Caso de error con la DB
    it('Responde 500 cuando la db lanza un error ', async () => {
        Usuario.getAllusers.mockRejectedValue(new Error('Connection lost'));

        const req = {};
        const res = mockRes();
        await get_lista_usuarios(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                ok: false,
                mensaje: 'Error con la DB'
            })
        );
    });
});

//describe de todos los casos de eliminar
describe('usuario.controller — delete_usuario', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });


    //caso de eliminar usuario correctamente
    it('Responde con true cuando eliminas usuario correctamente ', async () => {
        Usuario.getByid.mockResolvedValue({ id_usuario: 3, nombre_usuario: 'Activo'});
        Usuario.deleateByid.mockResolvedValue({ affectedRows: 1 });

        const req = { params: { id_usuario: 3} };
        const res = mockRes();
        await delete_usuario(req, res);
        
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                ok: true,
                mensaje: 'Usuario eliminado'
            })
        );
    });

    //caso cuando no se elimino el usuario
    it('Responde con false cuando no se elimina el usuario ', async () => {
        Usuario.getByid.mockRejectedValue(new Error('Connection lost'));

        const req = { params: { id_usuario: 3} };
        const res = mockRes();
        await delete_usuario(req, res);
        
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                ok: false,
                mensaje: 'Error usuario no eliminado'
            })
        );
    });

});

//Verifica si el usuario es un usuario verificado
describe('usuario.controller — delete_usuario', () => {
    
  it('Responde 200 cuando es usuario autorizado', () => {
        
        const req = {};
        const res = mockRes();
        get_usuario(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Autorizado' });
  });  

});
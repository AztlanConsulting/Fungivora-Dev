
const bcrypt = require('bcrypt');
const { post_registro } = require('../../controllers/nuevo_usuario.controller');

// Mockea el modelo
jest.mock('../../models/usuario.model');
jest.mock('bcrypt');
const Usuario = require('../../models/usuario.model');

// Helper que crea req/res falsos
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('usuario.controller — post_registro', () => {

    beforeEach(() => {
        // Limpia el historial de llamadas entre pruebas
        jest.clearAllMocks();
        // Silencia los console.error que se provocan intencionalmente
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    // ─── Casos de exitosos ───────────────────────────────────────────────────────

    //El registro de nuevo usuario es exitoso
    it('responde 201 cuando hay registro exitoso', async () => {
        
        const registroNuevo= { insertId: 42}
        Usuario.fetch_one.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedpassword')
        Usuario.anadir.mockResolvedValue(registroNuevo);

        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'juan@test.com',
            contrasena: '123'
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'Usuario creado', id: 42 
        });
    });

    // ─── Casos de error ───────────────────────────────────────────────────────

    //Los campos estan vacios
    it('responde 400 si faltan todos los campos', async () => {

        const req = { body: 
            {nombre_usuario: '', 
            correo_usuario: '', 
            contrasena: ''}};
;
        const res = mockRes();

        await post_registro (req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Llena todos los campos.'
        });
    });

    //el nombre es muy largo, sobrepasando mas de 100 caracteres
    it('responde 400 si el nombre tiene mas de 100 caracteres', async () => {
        // Caso límite: la tabla existe y la query funciona, pero no hay registros.

        const req = { body: {
            nombre_usuario: 'a'.repeat(101,),
            correo_usuario: 'juan@test.com',
            contrasena: '123'
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'El nombre no puede exceder 100 caracteres' 

        });
    });

    //La contraseña execde mas de 20 caracteres
    it('responde 400 si la contraseña exede de 20 caracteres', async () => {

        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'juan@test.com',
            contrasena: 'a'.repeat(21,),
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'La contraseña debe ser menor a 21 caracteres.' 
        });
    });

    //El correo introducido no es un correo valido
    it('responde 400 si el correo es invalido', async () => {

        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'soyunerror',
            contrasena: '123',
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'Ingrese un correo valido' 
        });
    });

    //El correo ya existe
    it('responde 409 si el correo ya está registrado', async () => {

        const usuarioExistente = { 
            id: 1, 
            correo_usuario: 'juan@test.com', 
            nombre_usuario: 'Juanfalso'             
        };
        Usuario.fetch_one.
        mockResolvedValueOnce(usuarioExistente);

        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'juan@test.com',
            contrasena: '123'
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'Hay un usuario registrado con ese correo, agregue otro correo' 
        });
    });

    //El usuario ya existe
    it('responde 409 si el usuario ya está registrado', async () => {

        const usuarioExistente = { 
            id: 1, 
            correo_usuario: 'spam@test.com', 
            nombre_usuario: 'Juanperez'             
        };
        Usuario.fetch_one
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(usuarioExistente);

        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'juan@test.com',
            contrasena: '123'
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'Hay un usuario registrado con ese Nombre, agregue otro nombre' 
        });
    });

    //Error con el fetchg y la DB
    it('responde 500 si la DB lanza un error en fetch_one', async () => {
        Usuario.fetch_one.mockRejectedValue(new Error('Connection lost'));

        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'juan@test.com',
            contrasena: '123'
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'Error al registrar usuario' 
        });
    });

    //bycrypt falla
    it('responde 500 si falla bycrypt', async () => {
        Usuario.fetch_one.mockResolvedValue(null);
        bcrypt.hash.mockRejectedValue(new Error('Hash error'))
        
        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'juan@test.com',
            contrasena: '123'
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'Error al registrar usuario' 
        });
    });

    //Hubo algun error con el registro
    it('responde 500 si falla el registro', async () => {
        
        Usuario.fetch_one.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedpassword');
        Usuario.anadir.mockRejectedValue(new Error('Insert faield'));

        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'juan@test.com',
            contrasena: '123'
        }};
        const res = mockRes();

        await post_registro(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: 'Error al registrar usuario' 
        });
    });

    //error con la DB
    it('responde 500 si la DB falla y manda error en la consola', async () => {
        Usuario.fetch_one.mockRejectedValue(new Error('Timeout'));
        
        const req = { body: {
            nombre_usuario: 'Juanperez',
            correo_usuario: 'juan@test.com',
            contrasena: '123'
        }};
        const res = mockRes();
        await post_registro(req, res);

        expect(console.error).toHaveBeenCalledWith(
            'Error en Registro vuelva a intentarlo más tarde', 
        expect.any(Error)
     );
    });
});
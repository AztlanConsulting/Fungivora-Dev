const verificarRol = require('../../../middleware/rbac'); 
const Usuario = require('../../../models/usuario.model');

jest.mock('../../../models/usuario.model', () => ({
    fetch_by_id: jest.fn()
}));

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('RBAC Middleware (verificarRol)', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        req = { user: { id_usuario: 1 } };
        res = mockRes();
        next = jest.fn();
    });

    describe('Cuando se requiere rol de Administrador (true)', () => {
        
        it('200 - debe llamar a next() si el usuario en la DB es admin', async () => {
            Usuario.fetch_by_id.mockResolvedValue({ is_user_admin: 1 });

            const middleware = verificarRol(true);
            await middleware(req, res, next);

            expect(Usuario.fetch_by_id).toHaveBeenCalledWith(1);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
        });

        it('403 - debe denegar acceso si el usuario en la DB es regular (is_user_admin === 0)', async () => {
            Usuario.fetch_by_id.mockResolvedValue({ is_user_admin: 0 });

            const middleware = verificarRol(true);
            await middleware(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: "No autorizado" });
        });
    });

    describe('Cuando se requiere rol de Usuario Regular (false)', () => {

        it('200 - debe llamar a next() si el usuario en la DB no es admin', async () => {
            Usuario.fetch_by_id.mockResolvedValue({ is_user_admin: 0 });

            const middleware = verificarRol(false);
            await middleware(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        it('403 - debe denegar acceso si el usuario en la DB resulta ser admin', async () => {
            Usuario.fetch_by_id.mockResolvedValue({ is_user_admin: 1 });

            const middleware = verificarRol(false);
            await middleware(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: "No autorizado" });
        });
    });

    describe('Casos de Errores y Validaciones de Seguridad', () => {

        it('401 - debe fallar si req.user no existe (no pasó por el authMiddleware)', async () => {
            req = { headers: {} }; 

            const middleware = verificarRol(true);
            await middleware(req, res, next);

            expect(Usuario.fetch_by_id).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ msg: "No autenticado" });
        });

        it('401 - debe fallar si el usuario no existe en la Base de Datos', async () => {
            Usuario.fetch_by_id.mockResolvedValue(undefined);

            const middleware = verificarRol(true);
            await middleware(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ msg: "Usuario no encontrado" });
        });

        it('500 - debe manejar excepciones del modelo y responder con error de servidor', async () => {
            Usuario.fetch_by_id.mockRejectedValue(new Error('Database disconnect'));

            const middleware = verificarRol(true);
            await middleware(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: "Error interno al validar permisos" });
        });
    });
});
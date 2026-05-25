const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/auth'); 
const jwtUtils = require('../../../util/jwtUtils'); 

describe('Auth Middleware Unit Tests', () => {
    let req;
    let res;
    let next;
    const CLAVE_TEST = "test_secret_key";

    beforeAll(() => {
        jwtUtils.SECRET = process.env.APP_ACCESS_KEY || CLAVE_TEST;
    });

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        
        jest.clearAllMocks();
    });

    // ─── Casos Exitosos ───────────────────────────────────────────────────────

    it('debe autorizar el acceso y llamar a next() si el token con formato "Bearer" es válido', () => {
        const payloadMock = { id: 1, usuario: 'tester', isAdmin: true };
        const tokenValido = jwt.sign(payloadMock, jwtUtils.SECRET, { expiresIn: '1h' });
        
        req.headers['authorization'] = `Bearer ${tokenValido}`;

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user).toMatchObject(payloadMock);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('debe autorizar el acceso y llamar a next() si se envía el token plano sin la palabra "Bearer"', () => {
        const payloadMock = { id: 2, usuario: 'op_cultivo', isAdmin: false };
        const tokenValido = jwt.sign(payloadMock, jwtUtils.SECRET, { expiresIn: '1h' });
        
        req.headers['authorization'] = tokenValido;

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user).toMatchObject(payloadMock);
        expect(res.status).not.toHaveBeenCalled();
    });

    // ─── Casos de Error ───────────────────────────────────────────────────────

    it('401 si el encabezado de autorización no existe', () => {
        authMiddleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: "No autorizado: Token faltante" });
    });

    it('401 con código TOKEN_EXPIRED si el token ya expiró', () => {
        const payloadMock = { id: 1 };
        const tokenExpirado = jwt.sign(payloadMock, jwtUtils.SECRET, { expiresIn: '-10s' });
        
        req.headers['authorization'] = `Bearer ${tokenExpirado}`;

        authMiddleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
            msg: "Token expirado", 
            code: "TOKEN_EXPIRED" 
        });
    });

    it('403 si el token está corrupto o mal firmado', () => {
        req.headers['authorization'] = 'Bearer token-totalmente-invalido-y-modificado';

        authMiddleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ msg: "Token inválido" });
    });
});
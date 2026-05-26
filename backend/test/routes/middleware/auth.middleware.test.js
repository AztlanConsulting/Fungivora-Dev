const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/auth'); 
const jwtUtils = require('../../../util/jwtUtils'); 

jest.mock('../../../util/jwtUtils');

describe('Auth Middleware Unit Tests', () => {
    let req;
    let res;
    let next;
    const CLAVE_TEST = "test_secret_key";

    beforeAll(() => {
        jwtUtils.getSecret.mockReturnValue(CLAVE_TEST);
    });

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('debe autorizar el acceso y llamar a next() si el token es válido', () => {
        const payloadMock = { id_usuario: 1, usuario: 'tester' }; 
        const tokenValido = jwt.sign(payloadMock, CLAVE_TEST, { expiresIn: '1h' });
        
        req.headers['authorization'] = `Bearer ${tokenValido}`;

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user).toMatchObject(payloadMock);
    });

    it('401 con código TOKEN_EXPIRED si el token ya expiró', () => {
        const tokenExpirado = jwt.sign({ id_usuario: 1 }, CLAVE_TEST, { expiresIn: '-1s' });
        
        req.headers['authorization'] = `Bearer ${tokenExpirado}`;

        authMiddleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
            code: "TOKEN_EXPIRED" 
        }));
    });

    it('403 si el token está corrupto o mal firmado', () => {
        req.headers['authorization'] = 'Bearer mal-token';

        authMiddleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ msg: "Token inválido" });
    });
});
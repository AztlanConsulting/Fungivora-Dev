const jwt = require('jsonwebtoken');
const jwtUtils = require('../util/jwtUtils')

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;

    if (!token) {
        return res.status(401).json({ msg: "No autorizado: Token faltante" });
    }

    try {
        const secretoAsignado = jwtUtils.SECRET || process.env.APP_ACCESS_KEY;
        
        const decoded = jwt.verify(token, secretoAsignado);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: "Token expirado", code: "TOKEN_EXPIRED" });
        }
        return res.status(403).json({ msg: "Token inválido" });
    }
};
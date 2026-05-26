// middleware/auth.js
const jwt = require('jsonwebtoken');
const jwtUtils = require('../util/jwtUtils');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;

    if (!token) return res.status(401).json({ msg: "Token faltante" });

    try {
        const decoded = jwt.verify(token, jwtUtils.getSecret());
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Token inválido" });
    }
};
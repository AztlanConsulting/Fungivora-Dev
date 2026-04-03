const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ msg: "No autorizado" });
    }

    try {
        const decoded = jwt.verify(token, "secreto_super_seguro");

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido" });
    }
};
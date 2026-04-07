const jwt = require('jsonwebtoken');

/*
* auth
Tener un token de autenticación para entrar al sistema
Metodo que decodifica y encuntre el token para dar acceso con un rol
@param token, decoded
*/
module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.json({ msg: "No autorizado" });
    }

    try {
        const decoded = jwt.verify(token, "secreto_super_seguro");

        req.user = decoded;

        next();
    } catch (error) {
        return res.json({ msg: "Token inválido" });
    }
};
const Usuario = require('../models/usuario.model');

const verificarRol = (rolPermitido) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.id_usuario) {
      return res.status(401).json({ msg: "No autenticado" });
    }

    try {
      const userDB = await Usuario.fetch_by_id(req.user.id_usuario);
      
      if (!userDB) return res.status(401).json({ msg: "Usuario no encontrado" });

      const esAdminDB = userDB.is_user_admin === 1;
      
      if (esAdminDB !== rolPermitido) {
        return res.status(403).json({ msg: "No autorizado" });
      }

      next();
    } catch (error) {
      console.error("Error en verificarRol:", error);
      res.status(500).json({ msg: "Error interno al validar permisos" });
    }
  };
};

module.exports = verificarRol;
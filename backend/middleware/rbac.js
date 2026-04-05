/*
* verificarRol
Verificar que tipo de rol tiene el usuario y sus permisos
Metodo que utiliza el rol para dar el permiso de administrador
@param rol
*/
const verificarRol = (rolPermitido) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.json({ msg: "No autenticado" });
    }

    if (req.user.rol !== rolPermitido) {
      return res.json({ msg: "No autorizado" });
    }

    next();
  };
};

module.exports = verificarRol;
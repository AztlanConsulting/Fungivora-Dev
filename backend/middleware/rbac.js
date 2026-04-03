/*
* verificarRol
verificar que tipo de rol tiene el usuario y sus permisos
Metodo que utiliza el rol para dar el permiso de administrador
@param rol
*/
const verificarRol = (rolPermitido) => {
  return (req, res, next) => {
    const rol = req.headers["rol"]; 

    if (rol !== rolPermitido) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    next();
  };
};

module.exports = verificarRol;
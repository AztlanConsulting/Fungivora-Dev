
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
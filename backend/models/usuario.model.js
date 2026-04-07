const db = require('../util/db');

class Usuario {
  constructor(id_usuario, nombre_usuario, correo_usuario, contrasena_usuario, estatus_usuario, id_rol) {
    this.id_usuario = id_usuario;
    this.nombre_usuario = nombre_usuario;
    this.correo_usuario = correo_usuario;
    this.contrasena_usuario = contrasena_usuario;
    this.estatus_usuario = estatus_usuario;
    this.id_rol = id_rol;
  }

    static fetchOne = async (nombre_usuario) => {
    const [filas] = await db.execute(
        `SELECT u.*, r.nombre_rol
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id_rol
        WHERE LOWER(TRIM(u.nombre_usuario)) = LOWER(TRIM(?))`,
        [nombre_usuario]
    );

    return filas[0];
    };
}

module.exports = Usuario;

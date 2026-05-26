const db = require('../util/db');

class Usuario {
  constructor(id_usuario, nombre_usuario, correo_usuario, contrasena_usuario, estatus_usuario, is_user_admin) {
    this.id_usuario = id_usuario;
    this.nombre_usuario = nombre_usuario;
    this.correo_usuario = correo_usuario;
    this.contrasena_usuario = contrasena_usuario;
    this.estatus_usuario = estatus_usuario;
    this.is_user_admin = is_user_admin;
  }

  static fetch_one = async (identificador) => {
    const [filas] = await db.execute(
      `SELECT id_usuario, nombre_usuario, correo_usuario, contrasena_usuario, estatus_usuario, is_user_admin 
      FROM Usuarios 
      WHERE LOWER(TRIM(nombre_usuario)) = LOWER(TRIM(?)) 
          OR LOWER(TRIM(correo_usuario)) = LOWER(TRIM(?))`,
      [identificador, identificador] 
    );
    return filas[0];
  };

  static crear = async (nuevoUsuario) => {
    return db.execute(
      `INSERT INTO Usuarios (nombre_usuario, correo_usuario, contrasena_usuario, estatus_usuario, is_user_admin) 
       VALUES (?, ?, ?, ?, ?)`
      , [
        nuevoUsuario.nombre_usuario, 
        nuevoUsuario.correo_usuario, 
        nuevoUsuario.contrasena_usuario, 
        nuevoUsuario.estatus_usuario || 'Activo', 
        nuevoUsuario.is_user_admin ?? 0 
      ]
    );
  };

  static fetch_all = async () => {
    const [filas] = await db.execute(
      `SELECT id_usuario, nombre_usuario, correo_usuario, estatus_usuario, is_user_admin 
       FROM Usuarios`
    );
    return filas;
  };
}

module.exports = Usuario;
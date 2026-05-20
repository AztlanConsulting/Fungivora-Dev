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

  //Se encarga de solo tener la ID, para comparativas
  static getByid = async (id_usuario) => {
    const [User] = await db.execute(
      'SELECT id_usuario, nombre_usuario FROM Usuarios WHERE id_usuario = ?',
       [id_usuario]
    );
    return User[0]
  } 

  //se encarga del delete del usuario, se maneja por id
  static deleateByid =async (id_usuario) =>{
    const [deleteUser] = await db.execute(
      'DELETE FROM Usuarios WHERE id_usuario = ?',
      [id_usuario]
    )
    return deleteUser
  }

  //obtiene la lista de todos los usuarios
  static getAllusers = async () => {
    const [Users] = await db.execute(
      'SELECT id_usuario, nombre_usuario, correo_usuario  FROM Usuarios'
    );
    return Users;
  } 
}

module.exports = Usuario;
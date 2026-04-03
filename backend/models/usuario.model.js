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
    try {
      const [filas] = await db.execute('SELECT * FROM usuarios WHERE usuario = ?', [nombre_usuario]);

      if (filas.length === 0) {
        console.log('Usuario no encontrado en la base de datos.');
      }
      
      return filas;
    } catch (error) {
      console.error('Error en fetchOne:', error);
      throw error;
    }
  };
}
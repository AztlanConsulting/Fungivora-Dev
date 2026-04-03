const db = require('../util/db');

class Roles{
      constructor(id_rol, nombre_rol, descripcion_rol) {
        this.id_rol = id_rol;
        this.nombre_rol = nombre_rol;
        this.descripcion_rol = descripcion_rol;
      }
}
const db = require('../util/db');

class Inventario {
  constructor(id_inventario, id_categoria, nombre_inventario, fecha_inventario, cantidad_inventario, unidad_medida, stock_recomendado, es_manufacturado) {
    this.id_inventario = id_inventario;
    this.id_categoria = id_categoria;
    this.nombre_inventario = nombre_inventario;
    this.fecha_inventario = fecha_inventario;
    this.cantidad_inventario = cantidad_inventario;
    this.unidad_medida = unidad_medida;
    this.stock_recomendado = stock_recomendado;
    this.es_manufacturado = es_manufacturado;
  }

    static fetch_all = async () => {
    const [filas] = await db.execute(
        `SELECT * FROM inventario`,
        []
    );

    return filas;
    };
}

module.exports = Inventario;

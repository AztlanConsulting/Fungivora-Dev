const db = require('../util/db'); 

class Insumos { 
    constructor(id_insumo, nombre_insumo, fecha_creacion_insumo, cantidad_insumo, unidad_medida_insumo, stock_minimo_insumo, es_manufacturado_insumo) { 
        this.id_insumo = id_insumo; 
        this.nombre_insumo = nombre_insumo; 
        this.fecha_creacion_insumo = fecha_creacion_insumo;
        this.cantidad_insumo = cantidad_insumo;
        this.unidad_medida_insumo = unidad_medida_insumo;
        this.stock_minimo_insumo = stock_minimo_insumo;
        this.es_manufacturado_insumo = es_manufacturado_insumo;
        
    } 
}

Insumos.fetch_categorias = async () => {
    const [filas] = await db.execute('SELECT * FROM categorias');
    return filas;
}


module.exports = Insumos;

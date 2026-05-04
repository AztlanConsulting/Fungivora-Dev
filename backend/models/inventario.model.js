const db = require('../util/db');

class Inventario {
    constructor(id_insumo, nombre, cantidad, unidad, stock_recomendado, caducable, fecha_caducidad) {
        this.id_insumo = id_insumo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.unidad = unidad;
        this.stock_recomendado = stock_recomendado;
        this.caducable = caducable;
        this.fecha_caducidad = fecha_caducidad;
    }

    // Obtiene todos los insumos + hongos/esporas (inóculos)
    static fetch_all = async () => {
        const [filas] = await db.execute(`
            SELECT 
                id_insumo,
                nombre,
                cantidad,
                unidad,
                stock_recomendado,
                caducable,
                fecha_caducidad,
                'insumo' AS tipo
            FROM Insumos

            UNION ALL

            SELECT
                id_inoculo     AS id_insumo,
                codigo_fungivora AS nombre,
                cantidad_disponible AS cantidad,
                unidad,
                stock_recomendado,
                0              AS caducable,
                NULL           AS fecha_caducidad,
                'inoculo'      AS tipo
            FROM Inoculos
        `);
        return filas;
    }

    // Obtiene todas las categorías disponibles
    static fetch_categorias = async () => {
        const [filas] = await db.execute('SELECT * FROM Categorias');
        return filas;
    }

    // Crea un nuevo insumo
    static crear_insumo = async (id_insumo, nombre, cantidad, stock_recomendado, unidad) => {
        const [resultado] = await db.execute(`
            INSERT INTO Insumos (
                id_insumo,
                nombre,
                cantidad,
                stock_recomendado,
                unidad,
                caducable
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            id_insumo,
            nombre,
            cantidad,
            stock_recomendado,
            unidad,
            0
        ]);
        return resultado;
    }
}

module.exports = Inventario;
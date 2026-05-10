const db = require('../util/db');

class Inventario {
    constructor(id_insumo, nombre, cantidad, unidad, stock_recomendado) {
        this.id_insumo = id_insumo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.unidad = unidad;
        this.stock_recomendado = stock_recomendado;
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
                'insumo' AS tipo
            FROM Insumos
        `);
        return filas;
    }

    // Obtiene todas las categorías
    static fetch_categorias = async () => {
        const [filas] = await db.execute('SELECT * FROM Categorias');
        return filas;
    }

    // Crea un nuevo insumo
        static crear_insumo = async (id_insumo, nombre, cantidad, stock_recomendado, unidad) => {
            return db.execute(`
                INSERT INTO Insumos (
                    id_insumo,
                    nombre, 
                    cantidad, 
                    stock_recomendado, 
                    unidad
                )
                VALUES (?, ?, ?, ?, ?)
            `, [id_insumo, nombre, cantidad, stock_recomendado, unidad]);
        }

    // Editar la cantidad
    static update_cantidad = async (id_insumo, nueva_cantidad) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [rows] = await connection.execute(
                'SELECT cantidad FROM Insumos WHERE id_insumo = ?', 
                [id_insumo]
            );
            
            if (rows.length === 0) throw new Error('Insumo no encontrado');

            const cantidadAnterior = parseFloat(rows[0].cantidad);
            const diferencia = nueva_cantidad - cantidadAnterior;

            if (diferencia === 0) {
                await connection.rollback();
                return true;
            }

            // Ve si es in o out dependiendo si se suma o resta
            const tipo = diferencia > 0 ? 'In' : 'Out';

            // Hace el update de los insumos
            await connection.execute(
                'UPDATE Insumos SET cantidad = ? WHERE id_insumo = ?',
                [nueva_cantidad, id_insumo]
            );

            await connection.execute(
                'INSERT INTO Logs_ins_outs (id_insumo, cantidad, tipo) VALUES (?, ?, ?)',
                [id_insumo, diferencia, tipo]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    };
}

module.exports = Inventario;
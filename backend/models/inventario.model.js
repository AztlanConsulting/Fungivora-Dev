const db = require('../util/db');

class Inventario {
    constructor(id_insumo, nombre, cantidad, unidad, stock_recomendado) {
        this.id_insumo = id_insumo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.unidad = unidad;
        this.stock_recomendado = stock_recomendado;
    }

    // Obtiene todos los insumos + inóculos
    static fetch_all = async () => {
        const [insumos] = await db.execute(`
            SELECT 
                id_insumo AS id,
                nombre,
                cantidad,
                unidad,
                stock_recomendado,
                'insumo' AS tipo
            FROM Insumos
        `);

        const [inoculos] = await db.execute(`
            SELECT 
                id_inoculo AS id,
                CONCAT(codigo_fungivora, ' · ', especie) AS nombre,
                cantidad_disponible AS cantidad,
                unidad,
                stock_recomendado,
                tipo
            FROM Inoculos
            WHERE cantidad_disponible > 0
            AND codigo_fungivora NOT REGEXP '^[A-Za-z0-9]{2,3}-'
        `);

        return [...insumos, ...inoculos];
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

    // Editar cantidad de insumo
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
                [id_insumo, Math.abs(diferencia), tipo]
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

    // Editar cantidad de inóculo + log
    static update_cantidad_inoculo = async (id_inoculo, nueva_cantidad) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [rows] = await connection.execute(
                'SELECT cantidad_disponible FROM Inoculos WHERE id_inoculo = ?',
                [id_inoculo]
            );

            if (rows.length === 0) throw new Error('Inóculo no encontrado');

            const cantidadAnterior = parseFloat(rows[0].cantidad_disponible);
            const diferencia = nueva_cantidad - cantidadAnterior;

            if (diferencia === 0) {
                await connection.rollback();
                return true;
            }

            const tipo = diferencia > 0 ? 'In' : 'Out';

            await connection.execute(
                'UPDATE Inoculos SET cantidad_disponible = ? WHERE id_inoculo = ?',
                [nueva_cantidad, id_inoculo]
            );

            await connection.execute(
                'INSERT INTO Logs_ins_outs (id_insumo, cantidad, tipo) VALUES (?, ?, ?)',
                [id_inoculo, Math.abs(diferencia), tipo]
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

    // Editar nombre, unidad y stock recomendado de un insumo
    static editar_insumo = async (id_insumo, nombre, unidad, stock_recomendado) => {
        const [rows] = await db.execute(
            'SELECT id_insumo FROM Insumos WHERE id_insumo = ?',
            [id_insumo]
        );

        if (rows.length === 0) throw new Error('Insumo no encontrado');

        const [result] = await db.execute(`
            UPDATE Insumos 
            SET nombre = ?, unidad = ?, stock_recomendado = ?
            WHERE id_insumo = ?
        `, [nombre, unidad, stock_recomendado, id_insumo]);

        return result;
    }
}

module.exports = Inventario;
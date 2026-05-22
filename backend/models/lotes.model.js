const db = require('../util/db');

class Lotes {
    constructor(id_lote, tipo_sustrato, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase) {
        this.id_lote = id_lote;
        this.tipo_sustrato = tipo_sustrato;
        this.codigo_fungivora = codigo_fungivora;
        this.fecha_lote = fecha_lote;
        this.ubicacion_lote = ubicacion_lote;
        this.activo = activo;
        this.fase = fase;
    }

    static async fetch_all() {
        try {
            const [filas] = await db.execute(`
                SELECT 
                    id_lote, 
                    tipo_sustrato, 
                    codigo_fungivora, 
                    fecha_lote, 
                    ubicacion_lote, 
                    activo, 
                    fase 
                FROM Lotes 
                ORDER BY fecha_lote DESC
            `);
            return filas;
        } catch (err) {
            console.error("Error en fetch_all lotes:", err);
            throw err;
        }
    }

    // Obtiene todas las categorías
    static fetch_categorias = async () => {
        const [filas] = await db.execute('SELECT * FROM Categorias');
        return filas;
    }

    // Metodo para asignar valores a la tabla de lotes
    static async crear_lote(id_lote, tipo_sustrato, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase) {
        try {
            return await db.execute(`
                INSERT INTO Lotes (
                    id_lote, tipo_sustrato, codigo_fungivora, 
                    fecha_lote, ubicacion_lote, activo, fase
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [id_lote, tipo_sustrato, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase]);
        } catch (err) {
            console.error("Error en crear_lote model:", err);
            throw err;
        }
    }

    //  Metodo para actualizar la fase del lote
    static async actualizar_fase(id_lote, nuevaFase) {
        try {
            const activo = (nuevaFase === "Finalización") ? 0 : 1;
            return await db.execute(`
                UPDATE Lotes 
                SET fase = ?, activo = ?
                WHERE id_lote = ?
            `, [nuevaFase, activo, id_lote]);
        } catch (err) {
            console.error("Error en actualizar_fase model:", err);
            throw err;
        }
    }

    // Metodo para encontrar los inoculos activos
    static async fetch_inoculos_disponibles() {
        try {
            const [filas] = await db.execute(`
                SELECT
                    i.id_inoculo,
                    i.codigo_fungivora,
                    i.especie,
                    i.cantidad_disponible,
                    i.unidad,
                    c.abreviatura_opcion AS abreviatura
                FROM Inoculos i
                LEFT JOIN Categorias c ON i.especie = c.nombre_opcion
                WHERE i.cantidad_disponible > 0
                ORDER BY i.fecha DESC
            `);
            return filas;
        } catch (err) {
            console.error("Error en fetch_inoculos_disponibles:", err);
            throw err;
        }
    }

    // Metodo para contar si ya existe un código igual e ir sumando 1
    static async count_lotes_similares(prefijo) {
        try {
            const [result] = await db.execute(`
                SELECT COUNT(*) as total 
                FROM Lotes 
                WHERE codigo_fungivora LIKE ?
            `, [`${prefijo}-%`]);

            return result[0].total;
        } catch (err) {
            console.error("Error en count_lotes_similares:", err);
            throw err;
        }
    }

    // Metodo para ordenar por codigo_fungivora la tabla de valores
    static async fetch_all() {
        try {
            const [filas] = await db.execute(`
                SELECT 
                    id_lote, 
                    tipo_sustrato, 
                    codigo_fungivora, 
                    fecha_lote, 
                    ubicacion_lote, 
                    activo, 
                    fase 
                FROM Lotes 
                ORDER BY 
                    fecha_lote DESC,
                    SUBSTRING_INDEX(SUBSTRING_INDEX(codigo_fungivora, '-', 2), '-', -1) ASC,
                    CAST(SUBSTRING_INDEX(codigo_fungivora, '-', -1) AS UNSIGNED) DESC
            `);
            return filas;
        } catch (err) {
            console.error("Error en fetch_all lotes:", err);
            throw err;
        }
    }

    // Metodo para eliminar un lote y sus bloques
    static async eliminar_lote(id_lote) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Bloques asociados
            await connection.execute('DELETE FROM Bloques WHERE id_lote = ?', [id_lote]);

            // Lote
            const [result] = await connection.execute('DELETE FROM Lotes WHERE id_lote = ?', [id_lote]);

            await connection.commit();
            return result;
        } catch (err) {
            await connection.rollback();
            console.error("Error en eliminar_lote model:", err);
            throw err;
        } finally {
            connection.release();
        }
    }

    // Método para revisar varios lotes
    static async revision_lotes(ids) {
        try {
            if (!ids || ids.length === 0) {
                return;
            }

            // (?, ?, ?, ...)
            const placeholders = ids.map(() => '?').join(',');

            await db.execute(`
                UPDATE Lotes
                SET fecha_ultima_revision = NOW()
                WHERE id_lote IN (${placeholders})
            `, ids);
        } catch (err) {
            console.error("Error en revision_lotes:", err);
            throw err;
        }
    }

    static async actualizar_ubicacion(id_lote, nuevaUbicacion) {
        try {
            return await db.execute(`
                UPDATE Lotes 
                SET ubicacion_lote = ? 
                WHERE id_lote = ?
            `, [nuevaUbicacion, id_lote]);
        } catch (err) {
            console.error("Error en actualizar_ubicacion model:", err);
            throw err;
        }
    }

    static async fetch_by_id(id_lote) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    l.*, 
                    i.especie 
                FROM Lotes l
                LEFT JOIN Bloques b ON l.id_lote = b.id_lote
                LEFT JOIN Inoculos i ON b.id_inoculo = i.id_inoculo
                WHERE l.id_lote = ?
                LIMIT 1
            `, [id_lote]);
            return rows[0];
        } catch (err) {
            console.error("Error en fetch_by_id:", err);
            throw err;
        }
    }
}

module.exports = Lotes;
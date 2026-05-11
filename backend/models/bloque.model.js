const db = require('../util/db');

class Bloque {
    constructor(id_bloque, id_lote, produccion, peso_gr, contaminado, contenedor) {
        this.id_bloque = id_bloque;
        this.id_lote = id_lote;
        this.produccion = produccion;
        this.peso_gr = peso_gr;
        this.contaminado = contaminado;
        this.contenedor = contenedor;
    }

    static async fetch_por_lote(id_lote) {
        try {
            const [filas] = await db.execute(`
                SELECT 
                    id_bloque,
                    id_lote,
                    produccion,
                    peso_gr,
                    contaminado,
                    contenedor
                FROM Bloques
                WHERE id_lote = ?
                ORDER BY id_bloque DESC
            `, [id_lote]);
            return filas;
        } catch (err) {
            console.error("Error en fetch_por_lote bloques:", err);
            throw err;
        }
    }

    // Metodo para actualización masiva de bloques de un lote
    static async actualizar_bloques_masivo(id_lote, bloques) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            for (const bloque of bloques) {
                const { id_bloque, contaminado } = bloque;
                await connection.execute(`
                        UPDATE Bloques 
                        SET contaminado = ? 
                        WHERE id_bloque = ? AND id_lote = ?
                    `, [contaminado, id_bloque, id_lote]);
            }
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            console.error("Error en actualizar_bloques_masivo model:", err);
            throw err;
        } finally {
            connection.release();
        }
    }

}

module.exports = Bloque;
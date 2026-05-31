const db = require('../util/db');

class Bloque {
    constructor(id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato) {
        this.id_bloque = id_bloque;
        this.id_lote = id_lote;
        this.id_inoculo = id_inoculo;
        this.produccion = produccion;
        this.peso_gr = peso_gr;
        this.contaminado = contaminado;
        this.contenedor = contenedor;
        this.tipo_sustrato = tipo_sustrato; 
    }

    // Metodo para encontrar los bloques por el lote
     static async fetch_por_lote(id_lote) {
        try {
            const query = `
                SELECT 
                    b.*, 
                    i.codigo_fungivora AS codigo_inoculo_bloque, 
                    i.especie AS especie_nombre,
                    l.codigo_fungivora AS codigo_lote_padre 
                FROM Bloques b
                JOIN Lotes l ON b.id_lote = l.id_lote
                JOIN Inoculos i ON b.id_inoculo = i.id_inoculo
                WHERE b.id_lote = ?
                ORDER BY b.id_bloque DESC
            `;
            const [filas] = await db.execute(query, [id_lote]);
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

    // Metodo para insertar los datos de bloque
    static async crear_bloque(nuevoBloque) {
        try {
            const { id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato } = nuevoBloque;
            return await db.execute(`
                INSERT INTO Bloques (
                    id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato]);
        } catch (err) {
            console.error("Error en crear_bloque model:", err);
            throw err;
        }
    }

    static async fetch_notas_by_id(id_bloque) {
        try {
            const query = `
                SELECT *
                FROM Bitacora_bloques
                WHERE id_bloque = ?
            `;
            const [filas] = await db.execute(query, [id_bloque]);
            return filas;
        } catch (err) {
            console.error("Error en fetch_notas_by_id");
            throw err;
        }
    }
}

module.exports = Bloque;
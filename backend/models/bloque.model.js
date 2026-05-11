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

    static async toggle_contaminado(id_bloque) {
        try {
            const [resultado] = await db.execute(`
                UPDATE Bloques
                SET contaminado = 1 - contaminado
                WHERE id_bloque = ?
            `, [id_bloque]);
            return resultado;
        } catch (err) {
            console.error("Error en actualizar_contaminados:", err);
            throw err;
        }
    }
}

module.exports = Bloque;
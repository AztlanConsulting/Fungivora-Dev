const db = require('../util/db');

class Dashboard {
    static async fetch_lotes_revision() {
        try {
            const [filas] = await db.execute(`
                SELECT *,
                    COALESCE(fecha_ultima_revision, fecha_lote) AS fecha_real
                FROM Lotes
                WHERE activo = 1
                AND COALESCE(fecha_ultima_revision, fecha_lote)
                    BETWEEN NOW() - INTERVAL 30 DAY
                        AND NOW() - INTERVAL 7 DAY
                ORDER BY fecha_real ASC;
            `);

            return filas;
        } catch (err) {
            console.error("Error en fetch_lotes_revision:", err);
            throw err;
        }
    }

    static async fetch_lotes_activos() {
        try {
            const [filas] = await db.execute(`
                SELECT COUNT(*) AS total
                FROM Lotes
                WHERE activo = 1
            `);

            return filas[0].total;
        } catch (err) {
            console.error("Error en fetch_lotes_activos:", err);
            throw err;
        }
    }

    static async fetch_bloques_por_estado(contaminado) {
        try {
            const [filas] = await db.execute(`
                SELECT COUNT(*) AS total
                FROM Bloques b
                INNER JOIN Lotes l
                    ON b.id_lote = l.id_lote
                WHERE l.activo = 1
                AND b.contaminado = ?
            `, [contaminado ? 1 : 0]);

            return filas[0].total;
        } catch (err) {
            console.error("Error en fetch_bloques_contaminados:", err);
            throw err;
        }
    }

    static async fetch_inventario_bajo() {
        try {
            const [filas] = await db.execute(`
                SELECT
                    id_insumo,
                    nombre,
                    cantidad,
                    unidad
                FROM Insumos
                WHERE cantidad < stock_recomendado
                ORDER BY nombre ASC
            `);

            return filas;
        } catch (err) {
            console.error("Error en fetch_inventario_bajo:", err);
            throw err;
        }
    }
}

module.exports = Dashboard;
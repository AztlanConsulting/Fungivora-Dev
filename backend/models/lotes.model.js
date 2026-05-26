const db = require('../util/db');
const crypto = require('crypto');

class Lotes {
    constructor(id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase) {
        this.id_lote = id_lote;
        this.codigo_fungivora = codigo_fungivora;
        this.fecha_lote = fecha_lote;
        this.ubicacion_lote = ubicacion_lote;
        this.activo = activo;
        this.fase = fase;
    }

    static async registrar_lote_y_bloques({ ubicacion_lote, fecha_lote, bloques, produccion }) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const idInoculoReferencia = bloques[0].id_inoculo;
            const inoculosDisponibles = await this.fetch_inoculos_disponibles(connection);
            const infoInoculo = inoculosDisponibles.find(i => i.id_inoculo == idInoculoReferencia);

            if (!infoInoculo) {
                throw new Error("Inóculo no encontrado o sin existencias disponibles");
            }

            const [abreviaturaResult] = await connection.execute(
                'SELECT abreviatura_opcion FROM Categorias WHERE nombre_opcion = ?', 
                [infoInoculo.especie]
            );
            const abreviatura = abreviaturaResult[0]?.abreviatura_opcion || "GEN";
            const fechaParaCodigo = new Date(fecha_lote);
            const fechaStr = `${String(fechaParaCodigo.getUTCDate()).padStart(2, '0')}${String(fechaParaCodigo.getUTCMonth() + 1).padStart(2, '0')}${fechaParaCodigo.getUTCFullYear().toString().slice(-2)}`;

            const prefijoBase = `LC-${abreviatura}-${fechaStr}`;
            const cantidadGrupo = await this.count_lotes_similares(prefijoBase);
            const codigo_fungivora = `${prefijoBase}-${cantidadGrupo + 1}`;

            const id_lote = crypto.randomUUID();

            await connection.execute(`
                INSERT INTO Lotes (id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, 1, "Inoculación"]);

            const promesasBloques = [];
            let totalSemillaUsada = 0;

            for (const b of bloques) {
                const numBloques = Number(b.cantidad) || 1;
                totalSemillaUsada += numBloques; 

                for (let i = 0; i < numBloques; i++) {
                    promesasBloques.push(
                        connection.execute(`
                            INSERT INTO Bloques (id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                            crypto.randomUUID(),
                            id_lote,
                            b.id_inoculo,
                            (b.produccion !== undefined) ? b.produccion : produccion,
                            b.peso_gr || 0,
                            0,
                            b.contenedor,
                            b.tipo_sustrato
                        ])
                    );
                }
            }
            await Promise.all(promesasBloques);

            const regexInoculoConsumible = /^[A-Z0-9]{1,3}-/;
            const esInoculoRestable = regexInoculoConsumible.test(infoInoculo.codigo_fungivora.toUpperCase());

            if (esInoculoRestable) {
                await this.usar_inoculo_transaccional(connection, idInoculoReferencia);
            }
            await connection.commit();
            return { id_lote, codigo_fungivora };

        } catch (error) {
            await connection.rollback();
            throw error; 
        } finally {
            connection.release();
        }
    }

    static async usar_inoculo_transaccional(connection, id_inoculo) {
        await connection.execute(`
            UPDATE Inoculos 
            SET cantidad_disponible = 0 
            WHERE id_inoculo = ?
        `, [id_inoculo]);
    }

    static fetch_categorias = async () => {
        const [filas] = await db.execute('SELECT * FROM Categorias');
        return filas;
    }

    static async crear_lote(id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase) {
        return await db.execute(`
            INSERT INTO Lotes (id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase]);
    }

    static async actualizar_fase(id_lote, nuevaFase) {
        const activo = (nuevaFase === "Finalización") ? 0 : 1;
        return await db.execute(`
            UPDATE Lotes SET fase = ?, activo = ? WHERE id_lote = ?
        `, [nuevaFase, activo, id_lote]);
    }

    static async fetch_inoculos_disponibles(connection = null) {
        const ejecutor = connection || db;
        const [filas] = await ejecutor.execute(`
            SELECT i.id_inoculo, i.codigo_fungivora, i.especie, i.cantidad_disponible, i.unidad, c.abreviatura_opcion AS abreviatura
            FROM Inoculos i
            LEFT JOIN Categorias c ON i.especie = c.nombre_opcion
            WHERE i.cantidad_disponible > 0
            ORDER BY i.fecha DESC
        `);
        return filas;
    }

    static async count_lotes_similares(prefijo) {
        const [result] = await db.execute(`
            SELECT COUNT(*) as total FROM Lotes WHERE codigo_fungivora LIKE ?
        `, [`${prefijo}-%`]);
        return result[0].total;
    }

    static async fetch_all() {
        const [filas] = await db.execute(`
            SELECT id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase 
            FROM Lotes 
            ORDER BY fecha_lote DESC,
                     SUBSTRING_INDEX(SUBSTRING_INDEX(codigo_fungivora, '-', 2), '-', -1) ASC,
                     CAST(SUBSTRING_INDEX(codigo_fungivora, '-', -1) AS UNSIGNED) DESC
        `);
        return filas;
    }

    static async eliminar_lote(id_lote) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute('DELETE FROM Bloques WHERE id_lote = ?', [id_lote]);
            const [result] = await connection.execute('DELETE FROM Lotes WHERE id_lote = ?', [id_lote]);
            await connection.commit();
            return result;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    static async limpiar_lotes_antiguos() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute(`
                DELETE FROM Bloques WHERE id_lote IN (SELECT id_lote FROM Lotes WHERE fecha_lote < DATE_SUB(NOW(), INTERVAL 3 MONTH))
            `);
            const [result] = await connection.execute(`
                DELETE FROM Lotes WHERE fecha_lote < DATE_SUB(NOW(), INTERVAL 3 MONTH)
            `);
            await connection.commit();
            return result;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    static async revision_lotes(ids) {
        if (!ids || ids.length === 0) return;
        const placeholders = ids.map(() => '?').join(',');
        await db.execute(`
            UPDATE Lotes SET fecha_ultima_revision = NOW() WHERE id_lote IN (${placeholders})
        `, ids);
    }

    static async actualizar_ubicacion(id_lote, nuevaUbicacion) {
        return await db.execute(`
            UPDATE Lotes SET ubicacion_lote = ? WHERE id_lote = ?
        `, [nuevaUbicacion, id_lote]);
    }

    static async fetch_by_id(id_lote) {
        const [rows] = await db.execute(`
            SELECT l.*, i.especie 
            FROM Lotes l
            LEFT JOIN Bloques b ON l.id_lote = b.id_lote
            LEFT JOIN Inoculos i ON b.id_inoculo = i.id_inoculo
            WHERE l.id_lote = ? LIMIT 1
        `, [id_lote]);
        return rows[0];
    }
}

module.exports = Lotes;
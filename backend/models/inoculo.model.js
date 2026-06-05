const db = require('../util/db');

module.exports = class Inoculo {

    // Obtiene todas las especies únicas registradas en la tabla Inoculos
    static fetchEspecies() {
        return db.execute(`
            SELECT nombre_opcion AS especie
            FROM Categorias 
            WHERE nombre_categoria = 'Especies'
            ORDER BY nombre_opcion ASC
        `);
    }

    /**
     * @description Obtiene los inóculos que coinciden con cierta especie y tipo
     * @param {string} especie - El nombre de la especie (por defecto es 'Shiitake').
     * @param {string} tipo - El tipo del inóculo (por defecto es 'Agar').
     */
    static fetchInoculosFiltrados(especie = 'Shiitake', tipo = 'Agar') {
        return db.execute(`
            SELECT *
            FROM Inoculos
            WHERE especie = ? AND tipo = ?
            ORDER BY fecha ASC
        `, [especie, tipo]);
    }

    // Método para obtener la especie del inóculo por su ID
    static async obtenerEspecie(id_inoculo) {
        try {
            const [filas] = await db.execute(`
                SELECT especie
                FROM Inoculos
                WHERE id_inoculo = ?
            `, [id_inoculo]);
            return filas[0]?.especie;
        } catch (err) {
            console.error("Error en obtenerEspecie model:", err);
            throw err;
        }
    }

    // Método para obtener el codigo_fungivora del inóculo por su ID
    static async obtenerCodigoFungivora(id_inoculo) {
        try {
            const [filas] = await db.execute(`
                SELECT codigo_fungivora
                FROM Inoculos
                WHERE id_inoculo = ?
            `, [id_inoculo]);
            return filas[0]?.codigo_fungivora;
        } catch (err) {
            console.error("Error en obtenerCodigoFungivora model:", err);
            throw err;
        }
    }

    /**
     * @description Obtiene los inóculos disponibles para ser usados como inóculo
     *              madre en la preparación de semillas. Solo devuelve registros de
     *              tipo 'Agar' y 'Medio Líquido' con cantidad_disponible > 0.
     */
    static fetchInoculosParaSemilla() {
        return db.execute(`
            SELECT
                id_inoculo,
                codigo_fungivora,
                especie,
                tipo,
                cantidad_disponible,
                unidad,
                stock_recomendado
            FROM Inoculos
            WHERE tipo IN ('Agar', 'Medio Líquido')
              AND cantidad_disponible > 0
            ORDER BY especie ASC, fecha DESC
        `);
    }

    // Obtiene todos los inóculos registrados en la tabla Inoculos
    static fetchInoculos() {
        return db.execute(`
            SELECT *
            FROM Inoculos
            ORDER BY fecha DESC
        `);
    }

    // Obtiene la cantidad total de ingredientes usados en todos los inóculos
    static fetchCantidadIngredientes() {
        return db.execute(`
            SELECT id_insumo, nombre, cantidad, unidad FROM Insumos
            WHERE nombre IN (
                'Peptona', 'Extracto de Malta',
                'Agua Destilada', 'Miel',
                'Jarabe de Maíz', 'Mijo Rojo',
                'Mijo Blanco', 'Agua', 'Agar agar')
        `);
    }

    // Crea un nuevo inóculo y registra sus ingredientes asociados
    static async insertInoculo({
        id_inoculo_usado,
        cantidad_usada,
        codigo_fungivora,
        tipo,
        especie,
        fecha,
        cantidad_disponible,
        unidad,
        stock_recomendado
    }, connection) {
        const [result] = await connection.execute(`
            INSERT INTO Inoculos (
                id_inoculo_usado, cantidad_usada,
                codigo_fungivora, tipo, especie,
                fecha, cantidad_disponible, unidad,
                stock_recomendado
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_inoculo_usado,
            cantidad_usada,
            codigo_fungivora,
            tipo,
            especie,
            fecha,
            cantidad_disponible,
            unidad,
            stock_recomendado
        ]);

        return result.insertId;
    }

    static async insertIngrediente({ inoculoId, ingredienteId, cantidad }, connection) {
        await connection.execute(`
            INSERT INTO Ingredientes (id_inoculo_creado, id_insumo, cantidad)
            VALUES (?, ?, ?)
        `, [inoculoId, ingredienteId, cantidad]);
    }

    static async insertBitacora({ inoculoId, fecha, nota }, connection) {
        await connection.execute(`
            INSERT INTO Bitacora_inoculos (id_inoculo, fecha_bitacora, notas_bitacora)
            VALUES (?, ?, ?)
        `, [inoculoId, fecha, nota]);
    }

    static async updateInsumo({ cantidad, ingredienteId }, connection) {
        await connection.execute(`
            UPDATE Insumos
            SET cantidad = cantidad - ?
            WHERE id_insumo = ?
        `, [cantidad, ingredienteId]);
    }

    static async updateInoculo({ cantidad_disponible, id }, connection) {
        await connection.execute(`
            UPDATE Inoculos
            SET cantidad_disponible = cantidad_disponible - ?
            WHERE id_inoculo = ?
        `, [cantidad_disponible, id]);
    }

    static async insertLog({ ingredienteId, cantidad, fecha, tipo }, connection) {
        await connection.execute(`
            INSERT INTO Logs_ins_outs (id_insumo, cantidad, fecha, tipo)
            VALUES (?, ?, ?, ?)
        `, [ingredienteId, cantidad, fecha, tipo]);
    }

    static async fetch_by_id(id_inoculo) {
        const [rows] = await db.execute(`
            SELECT i.*, 
                madre.codigo_fungivora AS nombre_inoculo_usado,
                i.id_inoculo_usado
            FROM Inoculos i
            LEFT JOIN Inoculos madre ON i.id_inoculo_usado = madre.id_inoculo
            WHERE i.id_inoculo = ? 
            LIMIT 1
        `, [id_inoculo]);

        if (rows.length === 0) return null;

        const inoculo = rows[0];
        const [ingredientes] = await db.execute(`
            SELECT i.id_insumo, ins.nombre, i.cantidad, ins.unidad
            FROM Ingredientes i
            JOIN Insumos ins ON i.id_insumo = ins.id_insumo
            WHERE i.id_inoculo_creado = ?
        `, [id_inoculo]);

        return { ...inoculo, ingredientes };
    }

    // Obtiene todas las notas de la bitácora para un inóculo específico
    static async fetch_notas_inoculo_by_id(id_inoculo) {
        try {
            const [filas] = await db.execute(`
                SELECT *
                FROM Bitacora_inoculos
                WHERE id_inoculo = ?
                ORDER BY fecha_bitacora DESC
            `, [id_inoculo]);
            return filas;
        } catch (err) {
            console.error("Error en fetch_notas_inoculo_by_id");
            throw err;
        }
    }

    // Registra una nueva nota en la bitácora del inóculo
    static async post_nota_inoculo(id_inoculo, fecha, notas_bitacora) {
        try {
            const query = `
                INSERT INTO Bitacora_inoculos (id_inoculo, fecha_bitacora, notas_bitacora)
                VALUES (?, ?, ?)
            `;
            const [resultado] = await db.execute(query, [id_inoculo, fecha, notas_bitacora]);
            return resultado;
        } catch (err) {
            console.error("Error en post_nota_inoculo");
            throw err;
        }
    }
};
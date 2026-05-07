// backend/models/inoculo.model.js
const db = require('../util/db');

module.exports = class Inoculo {

    // Obtiene todas las especies únicas registradas en la tabla Inoculos
    static fetchEspecies() {
        return db.execute(`
            SELECT DISTINCT especie
            FROM Inoculos
            WHERE especie IS NOT NULL
            ORDER BY especie ASC
        `);
    }

    /**
     * @description Obtiene los inóculos que coinciden con cierta especie y tipo
     * @param {string} especie - El nombre de la especie (por defecto es 'Shiitake').
     * @param {string} tipo - El tipo del inóculo (por defecto es 'Agar').
     * @returns {Promise} - Retorna una promesa con los inóculos de la consulta.
     * 
     * * IMPORTANTE: Asegúrate de que el nombre de la especie y el tipo sean correcton en la base de datos.
     */
    static fetchInoculosFiltrados(especie = 'Shiitake', tipo = 'Agar') {
        return db.execute(`
            SELECT *
            FROM Inoculos
            WHERE especie = ? AND tipo = ?
            ORDER BY fecha ASC
        `, [especie, tipo]);
    }


     // Obtiene todos los inóculos registrados en la tabla Inoculos
    static fetchInoculos() {
        return db.execute(`SELECT id_inoculo, codigo_fungivora, 
            tipo, especie, fecha, cantidad_disponible 
            FROM Inoculos
        ORDER BY fecha DESC`);
    }

    // Obtiene la cantidad total de ingredientes usados en todos los inóculos
    static fetchCantidadIngredientes() {
        return db.execute(`
            SELECT id_insumo, nombre, cantidad FROM Insumos 
            WHERE nombre IN (
            'Peptona', 'Extracto de Malta', 
            'Agua Destilada', 'Miel', 
            'Jarabe de Maíz', 'Mijo Rojo',
            'Mijo Blanco', 'Agua')
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
        // 1 — inserta el nuevo inóculo y obtiene su id
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

        const inoculoId = result.insertId;
        return inoculoId;
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
        const [rows] = await connection.execute(`
            UPDATE Insumos 
            SET cantidad = cantidad - ?
            WHERE id_insumo = ?
        `, [cantidad, ingredienteId]);
    }

    static async updateInoculo({ cantidad_disponible, id }, connection) {
        const [result] = await connection.execute(`
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

};
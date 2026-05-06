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
            'Jarabe de Maíz', 'Mijo Rojo')
        `);
    }

    // Crea un nuevo inóculo y registra sus ingredientes asociados
    static async createInoculo({codigo_fungivora,
        id_inoculo_usado,
        cantidad_usada,
        tipo,
        proceso,
        especie,
        fecha,
        cantidad_disponible,
        unidad,
        stock_recomendado
        }, connection) {
        // 1 — inserta el nuevo inóculo y obtiene su id
        const [result] = await connection.execute(`
            INSERT INTO Inoculos (id_inoculo_usado, cantidad_usada, codigo_fungivora, tipo, proceso, especie, fecha, cantidad_disponible, unidad, stock_recomendado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id_inoculo_usado, cantidad_usada, codigo_fungivora, tipo, proceso, especie, fecha, cantidad_disponible, unidad, stock_recomendado]);
        const inoculoId = result.insertId;
        return inoculoId;
    }

    static async insertIngrediente({ inoculoId, ingredienteId, cantidad }, connection) {
        await connection.execute(`
            INSERT INTO InoculoIngredientes (id_inoculo, id_ingrediente, cantidad) 
            VALUES (?, ?, ?)
        `, [inoculoId, ingredienteId, cantidad]);
    }
};
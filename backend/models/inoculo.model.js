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
};
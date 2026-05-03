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

};
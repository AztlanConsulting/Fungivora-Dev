const db = require('../util/database');

module.exports = class Micelio {
    
    // Método para crear el nuevo registro (Trazabilidad)
    static async registrar(datos, connection) {
        const { id_base, id_usuario, tipo, notas, cantidad_o_rendimiento, foto } = datos;
        
        // El id_resultado se genera automáticamente por la DB
        const query = `
            INSERT INTO micelio_sustrato (id_base, id_usuario, tipo, notas, cantidad_o_rendimiento, foto, fecha)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        
        // Usamos la conexión de la transacción (conn) enviada desde el controller
        const [result] = await connection.execute(query, [
            id_base, id_usuario, tipo, notas, cantidad_o_rendimiento, foto
        ]);
        
        return result;
    }

    // Método para registrar en el historial de acciones
    static async registrarHistorial(datos, connection) {
        const { id_usuario, id_resultado, accion } = datos;
        
        const query = `
            INSERT INTO historial_acciones (id_usuario, id_resultado, accion, fecha)
            VALUES (?, ?, ?, NOW())
        `;
        
        return await connection.execute(query, [id_usuario, id_resultado, accion]);
    }
    
    // Método para obtener los agares base (JOIN para el Select de la UI)
    static fetchAllAgares() {
        return db.execute(`
            SELECT id_micelio_sustrato, tipo, fecha 
            FROM micelio_sustrato 
            WHERE tipo = 'Agar'
        `);
    }
};
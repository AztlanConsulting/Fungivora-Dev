const db = require('../util/db');

module.exports = class Micelio {
    
   static async registrar(datos, connection) {
    const { 
        id_base = null, 
        id_usuario = null, 
        tipo = 'Medio Líquido', 
        notas = '', 
        cantidad_o_rendimiento = 0, 
        foto = 'No' 
    } = datos;
    
    const query = `
        INSERT INTO micelio_sustrato 
        (id_herencia, id_usuario, tipo, foto_ms, notas_ms, rendimiento, fecha_de_actualizacion)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await connection.execute(query, [
        id_base,                // Va a id_herencia
        id_usuario,             // Va a id_usuario
        tipo,                   // Va a tipo
        foto,                   // Va a foto_ms
        notas,                  // Va a notas_ms
        cantidad_o_rendimiento  // Va a rendimiento
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
            SELECT 
                id_micelio_sustrato, 
                tipo, 
                fecha_de_actualizacion AS fecha 
            FROM micelio_sustrato 
            WHERE tipo = 'agar' OR tipo = 'Agar'
        `);
    }
};
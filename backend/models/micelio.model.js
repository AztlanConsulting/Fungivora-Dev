// micelio.model.js
const db = require('../util/db');
const crypto = require('crypto');

module.exports = class Micelio {

    static async registrar(datos, connection) {
        const {
            id_base = null,
            id_usuario,
            nombre_base,
            notas = '',
            foto = 'No',
            cantidad_final = 0
        } = datos;

        const id_micelio_uuid = crypto.randomUUID();
        const id_resultado_uuid = crypto.randomUUID();
        const nombreDinamico = `${nombre_base} - Medio Líquido`;

        // ✅ PASO 1: INSERT en inventario primero para satisfacer el FK
        await connection.execute(`
            INSERT INTO inventario 
            (id_inventario, id_categoria, nombre_inventario, fecha_inventario, cantidad_inventario, unidad_medida, es_manufacturado)
            VALUES (?, 'a34de600-36bc-11f1-8d30-60e8d4bc1ce6', ?, NOW(), ?, 'ml', 1)
        `, [id_resultado_uuid,nombreDinamico, cantidad_final]);

        // ✅ PASO 2: INSERT en micelio_sustrato con id_resultado ya existente
        console.log('Ejecutando INSERT micelio_sustrato...', {
            id_micelio_uuid, id_resultado_uuid, id_usuario, foto, notas, id_base
        });

        await connection.execute(`
            INSERT INTO micelio_sustrato 
            (id_micelio_sustrato, id_resultado, id_usuario, foto_ms, notas_ms, fecha_de_actualizacion, id_herencia)
            VALUES (?, ?, ?, ?, ?, NOW(), ?)
        `, [
            id_micelio_uuid,
            id_resultado_uuid,
            id_usuario,
            foto,
            notas,
            id_base
        ]);

        return { insertId: id_micelio_uuid, id_resultado: id_resultado_uuid };
    }



    static fetchAllAgares() {
        return db.execute(`
            SELECT 
                i.id_inventario     AS id_micelio_sustrato,
                i.nombre_inventario AS tipo,
                i.fecha_inventario  AS fecha_de_actualizacion
            FROM inventario i
            WHERE i.id_categoria = 'a34cfb30-36bc-11f1-8d30-60e8d4bc1ce6'
            ORDER BY i.fecha_inventario DESC
        `);
    }
};
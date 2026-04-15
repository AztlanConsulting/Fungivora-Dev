const Micelio = require('../models/micelio.model');
const Inventario = require('../models/inventario.model');
const db = require('../util/db');

// ✅ handler para GET /agares-base
exports.get_agares_base = async (req, res, next) => {
    try {
        const [rows] = await Micelio.fetchAllAgares();
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener agares base:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// micelio.controller.js
exports.post_crear_medio_liquido = async (req, res, next) => {
    const { id_usuario, id_base, nombre_base, notas, foto, cantidad_final, ingredientes } = req.body;

    // Wrapper para usar transacciones sin getConnection()
    const conn = {
        execute: (sql, params) => db.execute(sql, params),
        beginTransaction: () => db.query('START TRANSACTION'),
        commit: () => db.query('COMMIT'),
        rollback: () => db.query('ROLLBACK'),
        release: () => {}
    };

    try {
        await conn.beginTransaction();

        // 1. Registro en inventario + micelio_sustrato
        const nuevoMicelio = await Micelio.registrar({
            id_base,
            id_usuario,
            nombre_base,
            notas,
            foto,
            cantidad_final
        }, conn);

        // 2. Descuento de insumos con UUIDs reales
        const mapaInsumos = {
            1: '7086f28c-3855-11f1-8d30-60e8d4bc1ce6', // Agua destilada
            2: 'a3341365db577fb08e5bba7c098dd8111123',   // Miel
            3: '7089ea3a-3855-11f1-8d30-60e8d4bc1ce6'   // Peptona
        };

        for (const item of ingredientes) {
            const id_inv = mapaInsumos[item.id_insumo];
            if (id_inv && item.cantidad_usada > 0) {
                await conn.execute(`
                    UPDATE inventario 
                    SET cantidad_inventario = cantidad_inventario - ?
                    WHERE id_inventario = ?
                `, [item.cantidad_usada, id_inv]);
            }
        }

        // 3. Historial (pendiente)
        // await Micelio.registrarHistorial({
        //     id_usuario,
        //     id_resultado: nuevoMicelio.id_resultado,
        //     accion: 'Creación de Medio Líquido'
        // }, conn);

        await conn.commit();
        res.status(201).json({ success: true, message: '¡Registro exitoso!' });

    } catch (error) {
        await conn.rollback();
        console.error("ERROR SISTEMA:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
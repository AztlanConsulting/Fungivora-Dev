// backend/controllers/micelio.controller.js
const Micelio = require('../models/micelio.model');
const Inventario = require('../models/inventario.model');
const db = require('../util/db'); // Tu conexión a la DB

exports.post_crear_medio_liquido = async (req, res, next) => {
    // Asegúrate de que estos nombres coincidan con el 'payload' del Frontend
    const { id_usuario, id_base, notas, cantidad_final, ingredientes, foto } = req.body;

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
        // Registro principal
        const nuevoMicelio = await Micelio.registrar({
            id_base,
            id_usuario,
            tipo: 'Medio Líquido',
            notas,
            cantidad_o_rendimiento: cantidad_final,
            foto
        }, conn);

        const id_resultado = nuevoMicelio.insertId;

        // El loop funcionará porque ahora 'ingredientes' es un Array
        for (const item of ingredientes) {
            if (item.cantidad_usada > 0) { // Solo descontar si se usó algo
                await Inventario.registrarMovimiento({
                    id_inventario: item.id_insumo,
                    id_usuario: id_usuario,
                    cantidad: item.cantidad_usada,
                    in_or_out: 'OUT'
                }, conn);

                await Inventario.actualizarStock(item.id_insumo, item.cantidad_usada, conn);
            }
        }

        await Micelio.registrarHistorial({
            id_usuario,
            id_resultado,
            accion: 'Creación de Medio Líquido'
        }, conn);

        await conn.commit();
        res.status(201).json({ success: true, message: 'Registro exitoso' });

    } catch (error) {
        await conn.rollback();
        console.error("Error detallado:", error); // Esto te dirá en la terminal qué falló
        res.status(500).json({ success: false, message: error.message });
    } finally {
        conn.release();
    }
};

exports.get_agares_base = async (req, res, next) => {
    try {
        const [rows] = await Micelio.fetchAllAgares();
        res.status(200).json(rows); 
    } catch (error) {
        console.error("Error en controller:", error);
        res.status(500).json({ message: "Error al obtener agares" });
    }
};

const Micelio = require('../models/micelio.model');
const Inventario = require('../models/inventario.model');
const db = require('../util/db');

exports.post_crear_medio_liquido = async (req, res, _next) => {
    const { id_usuario, id_base, notas, cantidad_final, ingredientes, foto } = req.body;

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
        const nuevoMicelio = await Micelio.anadir({
            id_base,
            id_usuario,
            tipo: 'Medio Líquido',
            notas,
            cantidad_o_rendimiento: cantidad_final,
            foto
        }, conn);

        const id_resultado = nuevoMicelio.insertId;

        for (const item of ingredientes) {
            await Inventario.registrarMovimiento({
                id_inventario: item.id_insumo,
                id_usuario: id_usuario,
                cantidad: item.cantidad_usada,
                in_or_out: 'OUT'
            }, conn);
            await Inventario.actualizarStock(item.id_insumo, item.cantidad_usada, conn);
        }

        await Micelio.registrarHistorial({
            id_usuario,
            id_resultado,
            accion: 'Creación de Medio Líquido'
        }, conn);

        await conn.commit();

        res.status(201).json({
            success: true,
            message: 'Medio líquido creado y stock actualizado correctamente'
        });

    } catch (error) {
        await conn.rollback();
        console.error("Error en la creación:", error);
        res.status(500).json({ success: false, message: 'Error en la transacción' });
    } finally {
        conn.release();
    }
};

exports.get_agares_base = async (req, res, _next) => {
    try {
        const [agares] = await Micelio.fetchAllAgares();
        res.status(200).json(agares);
    } catch (error) {
        console.error("Error al obtener agares base:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};
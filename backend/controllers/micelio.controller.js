// backend/controllers/micelio.controller.js
const Micelio = require('../models/micelio.model');
const Inventario = require('../models/inventario.model');
const db = require('../util/database'); // Tu conexión a la DB

exports.post_crear_medio_liquido = async (req, res, next) => {
    const { id_usuario, id_base, notas, cantidad_final, ingredientes, foto } = req.body;

    // 1. Iniciar transacción para asegurar el "descuento automático" e integridad
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
        // 2. Crear el registro en micelio_sustrato (Tabla principal del MER)
        // Se vincula con id_base para trazabilidad
        const nuevoMicelio = await Micelio.anadir({
            id_base,
            id_usuario,
            tipo: 'Medio Líquido',
            notas,
            cantidad_o_rendimiento: cantidad_final,
            foto
        }, conn);

        const id_resultado = nuevoMicelio.insertId;

        // 3. Loop de Descuento Automático para cada ingrediente (Agua, Miel, Peptona)
        // Esto impacta las tablas in_outs e inventario
        for (const item of ingredientes) {
            // Registrar la salida (OUT) [cite: 6]
            await Inventario.registrarMovimiento({
                id_inventario: item.id_insumo,
                id_usuario: id_usuario,
                cantidad: item.cantidad_usada,
                in_or_out: 'OUT'
            }, conn);

            // Actualizar el stock físico en la tabla inventario [cite: 6]
            await Inventario.actualizarStock(item.id_insumo, item.cantidad_usada, conn);
        }

        // 4. Registrar la acción en el historial para auditoría
        await Micelio.registrarHistorial({
            id_usuario,
            id_resultado,
            accion: 'Creación de Medio Líquido'
        }, conn);

        // Si todo sale bien, confirmamos los cambios
        await conn.commit();
        
        // Respuesta para que React realice el navigate('/inventario')
        res.status(201).json({ 
            success: true, 
            message: 'Medio líquido creado y stock actualizado correctamente' 
        });

    } catch (error) {
        // Si algo falla, se deshacen todos los cambios (Rollback)
        await conn.rollback();
        console.error("Error en la creación:", error);
        res.status(500).json({ success: false, message: 'Error en la transacción' });
    } finally {
        conn.release();
    }
};
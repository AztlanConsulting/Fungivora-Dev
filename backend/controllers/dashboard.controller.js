const Dashboard = require('../models/dashboard.model');

exports.fetch_dashboard = async (req, res, _next) => {
    try {
        const [
            lotesRevision,
            lotesActivos,
            bloquesContaminados,
            bloquesNoContaminados,
            inventarioBajo
        ] = await Promise.all([
            Dashboard.fetch_lotes_revision(),
            Dashboard.fetch_lotes_activos(),
            Dashboard.fetch_bloques_por_estado(true),
            Dashboard.fetch_bloques_por_estado(false),
            Dashboard.fetch_inventario_bajo()
        ]);

        // Formatear lotes
        const lotesFormateados = lotesRevision.map(lote => ({
            id: lote.id_lote,
            nombre: lote.codigo_fungivora,
            detalle: new Date(lote.fecha_lote).toLocaleDateString('es-MX'),
            ruta: `/lotes/detalle/${lote.id_lote}`
        }));

        // Formatear inventario
        const inventarioFormateado = inventarioBajo.map(insumo => ({
            id: insumo.id_insumo,
            nombre: insumo.nombre,
            detalle: `${parseFloat(insumo.cantidad)} ${insumo.unidad}`,
            ruta: null
        }));

        return res.status(200).json({
            cards: {
                lotesActivos,
                bloquesContaminados,
                bloquesNoContaminados
            },

            listas: {
                lotesRevision: lotesFormateados,
                inventarioBajo: inventarioFormateado
            },

            lotes: lotesRevision
        });
    } catch (err) {
        console.error("Error en fetch_dashboard:", err);

        return res.status(500).json({
            message: "Error obteniendo dashboard"
        });
    }
};
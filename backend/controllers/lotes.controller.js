const Lotes = require('../models/lotes.model');
const Categoria = require('../models/categoria.model');
const cron = require('node-cron');

// Limpieza automática a las 00:00 a.m.
cron.schedule('0 0 * * *', async () => {
    console.log('Iniciando revisión automática de lotes...');
    try {
        await Lotes.limpiar_lotes_antiguos();
    } catch (error) {
        console.error('Error al ejecutar la limpieza automática:', error);
    }
});

/*
* post_batch
* Registra el lote delegando la lógica transaccional completa al modelo.
*/
exports.post_batch = async (req, res) => {
    try {
        const { ubicacion_lote, fecha_lote, bloques, produccion } = req.body;

        if (!bloques || bloques.length === 0) {
            return res.status(400).json({ success: false, message: "No hay bloques para registrar" });
        }

        const resultado = await Lotes.registrar_lote_y_bloques({
            ubicacion_lote,
            fecha_lote,
            bloques,
            produccion
        });

        res.status(201).json({ 
            success: true, 
            codigo: resultado.codigo_fungivora, 
            id: resultado.id_lote 
        });

    } catch (error) {
        console.error("Error crítico en post_batch controller:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error interno al procesar e inocular el lote' 
        });
    }
};

/*
* get_batches
*/
exports.get_batches = async (req, res) => {
    try {
        const lotes = await Lotes.fetch();
        res.status(200).json({ success: true, data: lotes });
    } catch (err) {
        console.error("Error en get_batches controller:", err);
        res.status(500).json({ success: false, message: "Hubo un error al recuperar los lotes", error: err.message });
    }
};

exports.get_lotes_todos = async (req, res) => {
    try {
        const lotes = await Lotes.fetch_all();
        res.status(200).json({ success: true, data: lotes });
    } catch (err) {
        console.error("Error en get_batches controller:", err);
        res.status(500).json({ success: false, message: "Hubo un error al recuperar los lotes", error: err.message });
    }
};

/*
* get_categorias
*/
exports.get_categorias = async (req, res) => {
    try {
        const rows = await Lotes.fetch_categorias();
        res.status(200).json({ success: true, categorias: rows });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
* get_ubicaciones
*/
exports.get_ubicaciones = async (req, res) => {
    try {
        const [ubicaciones] = await Categoria.fetchOpciones('Ubicacion', false);
        res.status(200).json(ubicaciones);
    } catch {
        res.status(500).json({ success: false, error: 'Error al obtener ubicaciones' });
    }
};

/*
* get_inoculos_activos
*/
exports.get_inoculos_activos = async (req, res) => {
    try {
        const inoculos = await Lotes.fetch_inoculos_disponibles();
        res.status(200).json({ success: true, data: inoculos });
    } catch (error) {
        console.error('Error al obtener inóculos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener la lista de inóculos' });
    }
};

/*
* actualizar_fase
*/
exports.actualizar_fase = async (req, res) => {
    try {
        const { id_lote } = req.query;
        const { nuevaFase } = req.body;
        await Lotes.actualizar_fase(id_lote, nuevaFase);

        const fasesGranja = ["Fructificación", "Cosecha 1", "Cosecha 2", "Finalización"];
        if (fasesGranja.includes(nuevaFase)) {
            await Lotes.actualizar_ubicacion(id_lote, "Granja");
        }

        res.status(200).json({ success: true, message: 'Fase (y ubicación si aplica) actualizada con éxito' });
    } catch (error) {
        console.error("Error en actualizar_fase controller:", error);
        res.status(500).json({ success: false, message: 'Error al actualizar la fase del lote' });
    }
};

/*
* get_batch_by_id
*/
exports.get_batch_by_id = async (req, res) => {
    const { id_lote } = req.query;
    try {
        if (!id_lote) return res.status(400).json({ message: "ID de lote requerido" });
        const lote = await Lotes.fetch_by_id(id_lote);
        if (!lote) return res.status(404).json({ message: "Lote no encontrado" });
        res.json(lote);
    } catch (error) {
        console.error("Error en get_batch_by_id:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
* get_especies_unicas
*/
exports.get_especies_unicas = async (req, res) => {
    try {
        const inoculos = await Lotes.fetch_inoculos_disponibles();
        const especiesUnicas = [...new Set(inoculos.map(i => i.especie))];
        res.status(200).json({ success: true, data: especiesUnicas });
    } catch {
        res.status(500).json({ success: false, message: 'Error al obtener especies' });
    }
};

/*
* delete_batch
*/
exports.delete_batch = async (req, res) => {
    try {
        const { id_lote } = req.params;
        if (!id_lote) return res.status(400).json({ success: false, message: "ID de lote no proporcionado" });

        const result = await Lotes.eliminar_lote(id_lote);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Lote no encontrado" });

        res.status(200).json({ success: true, message: 'Lote y sus bloques asociados eliminados con éxito' });
    } catch (error) {
        console.error("Error en delete_batch controller:", error);
        res.status(500).json({ success: false, message: 'Error al eliminar el lote', error: error.message });
    }
};

/*
* revisar_lotes
*/
exports.revisar_lotes = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Ids inválidos" });
        }
        await Lotes.revision_lotes(ids);
        return res.status(200).json({ message: "Lotes revisados correctamente" });
    } catch (err) {
        console.error("Error en revisar_lotes:", err);
        return res.status(500).json({ message: "Error marcando lotes como revisados" });
    }
};
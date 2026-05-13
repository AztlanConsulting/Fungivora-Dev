const Bloque = require('../models/bloque.model');

/**
 * get_bloques_por_lote
 * Obtener la información de los bloques de un lote
 * Metodo que hace una llamada al modelo para obtener la info necesaria
 * @param {*} req 
 * @param {*} res 
 */
exports.get_bloques_por_lote = async (req, res) => {
    try {
        const { id_lote } = req.query;
        const bloques = await Bloque.fetch_por_lote(id_lote);

        res.status(200).json({
            success: true,
            data: bloques
        });

    } catch (err) {
        console.error("Error en get_bloques_por_lote controller:", err);

        res.status(500).json({
            success: false,
            message: "Hubo un error al recuperar los bloques",
            error: err.message
        });
    }
};

/**
 * Actualización masiva de bloques de un lote
 * Permite actualizar múltiples bloques de un lote en una sola operación
 * @param {string} id_lote - El ID del lote al que pertenecen los bloques
 * @param {Array} bloques - Un array de objetos con la información de los bloques a actualizar
 */
exports.actualizar_bloques_masivo = async (req, res) => {
    try {
        const { id_lote } = req.query;
        const { bloques } = req.body;
        await Bloque.actualizar_bloques_masivo(id_lote, bloques);

        res.status(200).json({
            success: true,
            message: 'Bloques del lote actualizados con éxito'
        });
    } catch (error) {
        console.error("Error en actualizar_bloques_masivo controller:", error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar los bloques del lote'
        });
    }
};
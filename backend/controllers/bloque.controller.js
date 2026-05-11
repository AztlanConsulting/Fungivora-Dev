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

exports.toggle_contaminado = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: "Debes enviar un array de ids"
            });
        }

        const resultados = await Promise.all(
            ids.map(id => Bloque.toggle_contaminado(id))
        );

        res.status(200).json({
            success: true,
            data: resultados
        });

    } catch (err) {
        console.error("Error en toggle_contaminado controller:", err);

        res.status(500).json({
            success: false,
            message: "Hubo un error al actualizar los bloques",
            error: err.message
        });
    }
}
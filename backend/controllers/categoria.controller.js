const Categoria = require('../models/categoria.model');

/**
 * Obtiene todas las categorías disponibles
 */
exports.get_categorias = async (req, res, _next) => {
    try {
        const [categorias] = await Categoria.fetchCategorias();

        res.status(200).json({
            success: true,
            data: categorias
        });
    } catch (error) {
        console.error('Error al obtener respuesta:', error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorias'
        });
    }
};

/** Obtiene las opciones de una categoría específica
 * @param {string} categoria - Nombre de la categoría (default: 'Especies')
 * @param {boolean} abreviado - Indica si se deben obtener las abreviaturas o los nombres completos
 */
exports.get_opciones = async (req, res, _next) => {
    try {
        const categoria = req.query.categoria || 'Especies';
        const abreviado = req.query.abreviado === 'true';

        const [opciones] = await Categoria.fetchOpciones(categoria, abreviado);

        res.status(200).json({
            success: true,
            data: opciones
        });
    } catch (error) {
        console.error('Error al obtener respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las opciones'
        });
    }
};

/** Obtiene todos los inserts de la tabla "Categorias"
 */

exports.get_categorias_completo = async (req, res) => {
    try {
        const [rows] = await Categoria.fetchTodasLasCategorias();
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error al obtener Categorias:", error);
        res.status(500).json({ success: false, message: "Error al obtener categorías" });
    }
};
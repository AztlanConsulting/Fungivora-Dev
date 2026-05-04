// backend/controllers/inoculo.controller.js
const Inoculo = require('../models/inoculo.model');

exports.get_especies = async (req, res, next) => {
    try {
        const [especies] = await Inoculo.fetchEspecies();

        res.status(200).json({
            success: true,
            data: especies
        });

    } catch (error) {
        console.error('Error al obtener especies:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las especies'
        });
    }
};

/** Obtiene los inóculos de una especie y tipo específicos
 * @param {string} especie - El nombre de la especie (por defecto es 'Shiitake').
 * @param {string} tipo - El tipo del inóculo (por defecto es 'Agar').
 */
exports.get_inoculos_filtrados = async (req, res, next) => {
    try {
        const especie = req.query.especie || 'Shiitake';
        const tipo = req.query.tipo || 'Agar';

        const [inoculos] = await Inoculo.fetchInoculosFiltrados(especie, tipo);

        res.status(200).json({
            success: true,
            data: inoculos
        });

    } catch (error) {
        console.error('Error al obtener respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los inoculos'
        });
    }
};

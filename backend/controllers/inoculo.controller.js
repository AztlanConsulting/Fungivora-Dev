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
const insumos = require('../models/insumos.model');

exports.get_categorias = async (req, res) => {
    try {
        const [rows] = await insumos.fetch_categorias();
        res.status(200).json({
            status: 'success',
            categorias: rows,

        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};


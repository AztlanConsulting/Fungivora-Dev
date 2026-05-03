const Lotes = require('../models/lotes.model');

/*
* get_batches
Obtener la información de los lotes
Metodo que hace una llamada al modelo para obtener la info necesaria
@param filas
*/
exports.get_batches = async (req, res) => {
    try {
        const lotes = await Lotes.fetch_all();
        
        res.status(200).json({
            success: true,
            data: lotes
        });

    } catch (err) {
        console.error("Error en get_batches controller:", err);
        
        res.status(500).json({
            success: false,
            message: "Hubo un error al recuperar los lotes",
            error: err.message
        });
    }
};
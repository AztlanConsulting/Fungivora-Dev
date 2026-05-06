const Lotes = require('../models/lotes.model');
const crypto = require('crypto');

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

/*
* post_batch
Mandar la información del lote
Metodo que añade la información de lotes a la tabla
@param ubicacion_lote
*/
exports.post_batch = async (req, res) => {
    try {
        const { ubicacion_lote } = req.body;

        // Generar el id
        const id_lote = crypto.randomUUID();

        // Actualmente los valores de fecha, ubicación, activo y fase si estan correctos
        const id_inoculo = null; 
        const tipo_sustrato = "Pendiente"; // Sustrato dummy
        const codigo_fungivora = `LOT-${Date.now().toString()}`; // Codigo dummy
        const fecha_lote = new Date();
        const activo = 1;
        const fase = "Inoculación";

        await Lotes.crear_lote(
            id_lote, 
            id_inoculo, 
            tipo_sustrato, 
            codigo_fungivora, 
            fecha_lote, 
            ubicacion_lote, 
            activo, 
            fase
        );

        res.status(201).json({
            success: true,
            message: 'Lote creado con éxito',
            id: id_lote
        });

    } catch (error) {
        console.error("Error en post_batch:", error);
        res.status(500).json({ 
            success: false, 
            error: 'Error interno al crear el lote' 
        });
    }
};
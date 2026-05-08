const Lotes = require('../models/lotes.model');
const Categoria = require('../models/categoria.model'); 
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
* get_categorias
* Obtiene todas las categorías disponibles
*/
exports.get_categorias = async (req, res) => {
    try {
        const rows = await Lotes.fetch_categorias();

        res.status(200).json({
            success: true,
            categorias: rows,
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/*
* get_sustratos
* Obtiene todas los sustratos de la tabla de categorias
* Funciona al tener el fetch por 'Sustrato'
*/
exports.get_sustratos = async (req, res) => {
    try {
        const [sustratos] = await Categoria.fetchOpciones('Sustrato', false);
        res.status(200).json(sustratos);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener sustratos' });
    }
};

/*
* get_ubicaciones
* Obtiene todas las ubicaciones de la tabla de categorias
* Funciona al tener el fetch por 'Ubicacion'
*/
exports.get_ubicaciones = async (req, res) => {
    try {
        const [ubicaciones] = await Categoria.fetchOpciones('Ubicacion', false);
        res.status(200).json(ubicaciones);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener ubicaciones' });
    }
};

/*
* get_especies
* Obtiene todas las especies de la tabla de categorias
* Funciona al tener el fetch por 'Especies'
*/
exports.get_especies = async (req, res) => {
    try {
        const [especies] = await Categoria.fetchOpciones('Especies', false);
        res.status(200).json(especies);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener especies' });
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
        const { ubicacion_lote, tipo_sustrato, especies } = req.body;

        const id_lote = crypto.randomUUID();
        const abreviatura = await Categoria.fetchAbreviaturaPorNombre('Especies', especies);
        const prefijo = abreviatura 
            ? abreviatura.toUpperCase() 
            : (especies ? especies.substring(0, 3).toUpperCase() : "LOT");

        const sufijoUnico = Date.now().toString().slice(-5);
        const codigo_fungivora = `${prefijo}-${sufijoUnico}`;

        const id_inoculo = null; 
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
            codigo: codigo_fungivora
        });

    } catch (error) {
        console.error("Error en post_batch:", error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al crear el lote' 
        });
    }
};
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
* get_inoculos_activos
* Obtiene todos inoculos activos existentes en la tabla de inoculos
* Funciona al tener el fetch desde la tabla de inoculos
*/
exports.get_inoculos_activos = async (req, res) => {
    try {
        const inoculos = await Lotes.fetch_inoculos_disponibles();
        
        res.status(200).json({
            success: true,
            data: inoculos
        });
    } catch (error) {
        console.error('Error al obtener inóculos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de inóculos'
        });
    }
};

/*
* post_batch
Mandar la información del lote
Metodo que añade la información de lotes a la tabla
@param ubicacion_lote, tipo_sustrato, id_inoculo 
*/
exports.post_batch = async (req, res) => {
    try {
        const { ubicacion_lote, tipo_sustrato, id_inoculo } = req.body;
        const inoculos = await Lotes.fetch_inoculos_disponibles();
        const inoculoSeleccionado = inoculos.find(i => i.id_inoculo == id_inoculo);

        if (!inoculoSeleccionado) {
            return res.status(400).json({ success: false, message: "Inóculo no encontrado" });
        }

        // Obtener la abreviatura
        const [abreviaturaResult] = await Categoria.fetchAbreviaturaPorNombre(inoculoSeleccionado.especie);
        const abreviatura = abreviaturaResult[0].abreviatura_opcion;

        // Fecha en formato
        const hoy = new Date();
        const dd = String(hoy.getDate()).padStart(2, '0');
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const yy = hoy.getFullYear().toString().slice(-2);
        const fechaFormateada = `${dd}${mm}${yy}`;

        // El codigo escrito
        const codigo_fungivora = `LT-${abreviatura}-${fechaFormateada}`;
        
        const id_lote = crypto.randomUUID();
        const activo = 1;
        const fase = "Inoculación";

        // Guardar
        await Lotes.crear_lote(
            id_lote, 
            id_inoculo,
            tipo_sustrato, 
            codigo_fungivora, 
            hoy,
            ubicacion_lote, 
            activo, 
            fase
        );

        res.status(201).json({
            success: true,
            message: 'Lote creado con éxito',
            codigo: codigo_fungivora,
            id: id_lote
        });

    } catch (error) {
        console.error("Error en post_batch controller:", error);
        res.status(500).json({ 
            success: false, 
            error: 'Error interno al procesar el lote' 
        });
    }
};
//se encarga de resibir y renderisar los datos de la DB a la vista de semilla y sus estados como sus errores

const Semilla        = require('../models/semilla.model');

//LLena toda la lista de datos disponibles de semilla
exports.get_seleccionar_semilla = async (req, res) => {
    try {
        const filas = await Semilla.fetch_all_semillas();
        res.json(filas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener semillas" });
    }
};

//carga datos de la vista de semilla
exports.get_semilla = async (req, res) => {
    try {
        const granos   = await Semilla.fetch_all_granos();
        const micelios = await Semilla.fetch_all_micelios();
        res.json({ granos, micelios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
};

//estructura completa de la db
exports.post_anadir_semilla = async (req, res) => {
    try {
        const {
            id_herencia,
            nombre_inventario,
            rendimiento,
            unidad_medida,
            tipoGrano,
            cantidadGrano,
            micelio,
            cantidadMicelio,
            notas,
            foto
        } = req.body;

        const nuevo_id = await Semilla.anadir({
            id_herencia,
            nombre_inventario,
            rendimiento,
            unidad_medida,
            tipoGrano,
            cantidadGrano,
            micelio,
            cantidadMicelio,
            notas,
            foto: foto || null // base64 directo a DB
        });

        res.status(201).json({ msg: "Semilla registrada", id: nuevo_id });
    } catch (error) {
        console.error("Error en post_anadir_semilla:", error);
        res.status(500).json({ error: "Error al registrar semilla" });
    }
};
//Controller que se encarga de resibir y renderisar todos los datos de la db de agar y sus estados como sus errores

const Agar           = require('../models/agar.model');


//Da toda la lista de info disponible de agar desde la db
exports.get_seleccionar_agar = async (req, res) => {
    try {
        const filas = await Agar.fetch_all_agars();
        res.json(filas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener agars" });
    }
};

//carga datos a la vista de la DB
exports.get_agar = async (req, res) => {
    try {
        const granos = await Agar.fetch_all_granos();
        res.json({ granos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
};


//Resibe y crea tanto el formulario como el registro de todos los datos a usar
exports.post_anadir_agar = async (req, res) => {
    try {
        const {
            id_herencia,
            nombre_inventario,
            rendimiento,
            unidad_medida,
            tipoGrano,
            cantidadGrano,
            notas,
            foto
        } = req.body;

        const nuevo_id = await Agar.anadir({
            id_herencia,
            nombre_inventario,
            rendimiento,
            unidad_medida,
            tipoGrano,
            cantidadGrano,
            notas,
            foto: foto || null // base64 directo a DB
        });
        res.status(201).json({ msg: "Agar registrado", id: nuevo_id });
    } catch (error) {
        console.error("Error en post_anadir_agar:", error);
        res.status(500).json({ error: "Error al registrar agar" });
    }
};
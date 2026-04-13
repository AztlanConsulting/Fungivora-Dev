const { randomUUID } = require('crypto');
const Agar           = require('../models/agar.model');

exports.get_seleccionar_agar = async (req, res) => {
    try {
        const filas = await Agar.fetch_all_agars();
        res.json(filas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener agars" });
    }
};

exports.get_agar = async (req, res) => {
    try {
        const granos = await Agar.fetch_all_granos();
        res.json({ granos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos" });
    }
};

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
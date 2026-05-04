const Inventario = require('../models/inventario.model');
const crypto = require('crypto');

/*
* get_inventory
* Obtiene todos los insumos
*/
exports.get_inventory = async (req, res) => {
    try {
        const filas = await Inventario.fetch_all();

        res.status(200).json({
            success: true,
            data: filas
        });
    } catch (error) {
        console.error('Error al obtener inventario:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener inventario'
        });
    }
};

/*
* get_categorias
* Obtiene todas las categorías disponibles
*/
exports.get_categorias = async (req, res) => {
    try {
        const rows = await Inventario.fetch_categorias();

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
* post_crear_insumo
* Crea un nuevo insumo verificando que no exista previamente
*/
exports.post_crear_insumo = async (req, res) => {
    try {
        const filas = await Inventario.fetch_all();
        const { nombre, cantidad, stock_recomendado, unidad } = req.body;

        // Verifica que no exista un insumo con el mismo nombre
        const existe = filas.some(item =>
            item.nombre?.toLowerCase() === nombre?.toLowerCase()
        );

        if (existe) {
            return res.status(400).json({
                success: false,
                error: 'El insumo ya existe'
            });
        }

        // Genera un ID único basado en el nombre y la fecha actual
        const fecha_actual = new Date().toISOString();
        const id_insumo = crypto
            .createHash('sha256')
            .update(`${nombre}-${fecha_actual}`)
            .digest('hex')
            .substring(0, 36);

        await Inventario.crear_insumo(id_insumo, nombre, cantidad, stock_recomendado, unidad);

        res.status(201).json({
            success: true,
        });

    } catch (error) {
        console.error('Error al crear insumo:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear insumo'
        });
    }
};
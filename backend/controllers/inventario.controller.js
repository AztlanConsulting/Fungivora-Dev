const Inventario = require('../models/inventario.model');
const Categoria = require('../models/categoria.model');
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
* get_unidades
* Obtiene todas las unidades de la tabla de categorias
* Funciona al tener el fetch por 'Unidad'
*/
exports.get_unidades = async (req, res) => {
    try {
        const [unidades] = await Categoria.fetchOpciones('Unidad', false);
        res.status(200).json(unidades);
    } catch {
        res.status(500).json({ success: false, error: 'Error al obtener unidades' });
    }
};

/*
* post_crear_insumo
* Crea un nuevo insumo verificando que no exista previamente
*/
exports.post_crear_insumo = async (req, res) => {
    try {
        const { nombre, cantidad, stock_recomendado, unidad } = req.body;

        if (!nombre || !cantidad || !unidad) {
            return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
        }

        const filas = await Inventario.fetch_all();
        const existe = filas.some(item =>
            item.nombre?.toLowerCase() === nombre?.toLowerCase()
        );

        if (existe) {
            return res.status(400).json({ success: false, error: 'El insumo ya existe' });
        }

        const id_insumo = crypto.randomUUID();

        await Inventario.crear_insumo(id_insumo, nombre, cantidad, stock_recomendado, unidad);

        res.status(201).json({
            success: true,
            message: 'Insumo creado con éxito',
            id: id_insumo
        });

    } catch {
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/*
* post_update_cantidad
* Cambia la cantidad en la tabla de in y outs
*/
exports.post_update_cantidad = async (req, res) => {
    try {
        const { id_insumo, cantidad } = req.body;
        const nuevaCantidad = parseFloat(cantidad);

        if (!id_insumo || isNaN(nuevaCantidad)) {
            return res.status(400).json({
                success: false,
                error: 'Datos insuficientes'
            });
        }

        await Inventario.update_cantidad(id_insumo, nuevaCantidad);

        res.status(200).json({
            success: true,
            message: 'Inventario actualizado'
        });
    } catch (error) {
        console.error("DETAILED ERROR:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/*
* put_editar_insumo
* Edita nombre, unidad y stock recomendado de un insumo existente
*/
exports.put_editar_insumo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, unidad, stock_recomendado } = req.body;

        if (!nombre || !unidad || stock_recomendado === undefined) {
            return res.status(400).json({ 
                success: false, 
                error: 'Faltan campos obligatorios' 
            });
        }

        if (stock_recomendado <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'El stock recomendado debe ser mayor a 0' 
            });
        }

        await Inventario.editar_insumo(id, nombre, unidad, stock_recomendado);

        res.status(200).json({
            success: true,
            message: 'Insumo actualizado correctamente'
        });

    } catch (error) {
        if (error.message === 'Insumo no encontrado') {
            return res.status(404).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: 'Error interno del servidor' }); // ← faltaba esto
    } // ← faltaba cerrar el catch y la función
};


/*
* post_update_cantidad_inoculo
* Cambia la cantidad de un inóculo y registra el movimiento en logs
*/
exports.post_update_cantidad_inoculo = async (req, res) => {
    try {
        const { id_inoculo, cantidad } = req.body;
        const nuevaCantidad = parseFloat(cantidad);

        if (!id_inoculo || isNaN(nuevaCantidad)) {
            return res.status(400).json({
                success: false,
                error: 'Datos insuficientes'
            });
        }

        await Inventario.update_cantidad_inoculo(id_inoculo, nuevaCantidad);

        res.status(200).json({
            success: true,
            message: 'Inóculo actualizado'
        });
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};
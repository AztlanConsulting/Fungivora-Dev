// backend/controllers/inoculo.controller.js
const Inoculo = require('../models/inoculo.model');

exports.get_especies = async (req, res, _next) => {
    try {
        const [especies] = await Inoculo.fetchEspecies();
        res.status(200).json({ success: true, data: especies });
    } catch (error) {
        console.error('Error al obtener especies:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las especies' });
    }
};

exports.get_inoculos_filtrados = async (req, res, _next) => {
    try {
        const especie = req.query.especie || 'Shiitake';
        const tipo = req.query.tipo || 'Agar';
        const [inoculos] = await Inoculo.fetchInoculosFiltrados(especie, tipo);
        res.status(200).json({ success: true, data: inoculos });
    } catch (error) {
        console.error('Error al obtener inóculos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los inóculos' });
    }
};

exports.get_inoculos = async (req, res, _next) => {
    try {
        const [inoculos] = await Inoculo.fetchInoculos();
        res.status(200).json({ success: true, data: inoculos });
    } catch (error) {
        console.error('Error al obtener inóculos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los inóculos' });
    }
};

exports.get_cantidad_ingredientes = async (req, res, _next) => {
    try {
        const [cantidad] = await Inoculo.fetchCantidadIngredientes();
        res.status(200).json({ success: true, data: cantidad });
    } catch (error) {
        console.error('Error al obtener cantidad de ingredientes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener la cantidad de ingredientes' });
    }
};

/** Obtiene los inóculos disponibles para ser usados como inóculo madre
 *  en la preparación de semillas (tipo Agar o Medio Líquido con stock > 0).
 */
exports.get_inoculos_para_semilla = async (req, res, _next) => {
    try {
        const [inoculos] = await Inoculo.fetchInoculosParaSemilla();
        res.status(200).json({ success: true, data: inoculos });
    } catch (error) {
        console.error('Error al obtener inóculos para semilla:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los inóculos para semilla' });
    }
};

/**
 * Crea un nuevo inóculo, registra sus ingredientes asociados
 * y actualiza el stock de los insumos usados, todo dentro de una transacción
 */
exports.post_crear_inoculo = async (req, res, next) => {
    const {
        codigo_fungivora,
        tipo,
        especie,
        fecha,
        cantidad_disponible,
        unidad,
        num_repeticiones,
        nota,
        stock_recomendado,
        inoculo_usado,
        ingredientes
    } = req.body;

    const db = require('../util/db');
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        for (let i = 1; i <= num_repeticiones && i <= 15; i++) {
            const codigo_actual = i > 1 ? `${codigo_fungivora}-${i}` : `${codigo_fungivora}-${"1"}`;

            const inoculoId = await Inoculo.insertInoculo({
                id_inoculo_usado: inoculo_usado.id,
                cantidad_usada: inoculo_usado.cantidad,
                codigo_fungivora: codigo_actual,
                tipo, especie, fecha,
                cantidad_disponible, unidad, stock_recomendado
            }, connection);

            for (const ingrediente of ingredientes) {
                await Inoculo.insertIngrediente({
                    inoculoId,
                    ingredienteId: ingrediente.id,
                    cantidad: ingrediente.cantidad
                }, connection);
            }

            if (nota != null && nota.trim() !== "") {
                await Inoculo.insertBitacora({ inoculoId, fecha, nota }, connection);
            }

            for (const ingrediente of ingredientes) {
                await Inoculo.updateInsumo({
                    ingredienteId: ingrediente.id,
                    cantidad: ingrediente.cantidad
                }, connection);
            }

            await Inoculo.updateInoculo({
                cantidad_disponible: inoculo_usado.cantidad,
                id: inoculo_usado.id
            }, connection);

            for (const ingrediente of ingredientes) {
                await Inoculo.insertLog({
                    ingredienteId: ingrediente.id,
                    cantidad: ingrediente.cantidad,
                    fecha, tipo: 'Out'
                }, connection);
            }
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Inóculo creado exitosamente' });

    } catch (error) {
        await connection.rollback();

        if (error.message === 'STOCK_INSUFICIENTE') {
            return res.status(422).json({
                success: false,
                message: 'Stock insuficiente para uno o más ingredientes'
            });
        }
        next(error);
    } finally {
        connection.release();
    }
};

exports.get_especie = async (req, res) => {
    try {
        const { id_inoculo } = req.query;
        const especie = await Inoculo.obtenerEspecie(id_inoculo);
        res.status(200).json({
            success: true,
            data: especie
        });

    } catch (error) {
        console.error('Error al obtener respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la especie del inóculo'
        });
    }
}

exports.get_codigo_fungivora = async (req, res) => {
    try {
        const { id_inoculo } = req.query;
        const codigo = await Inoculo.obtenerCodigoFungivora(id_inoculo);
        res.status(200).json({
            success: true,
            data: codigo
        });

    } catch (error) {
        console.error('Error al obtener respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el código del inóculo'
        });
    }
}

/*
* get_inoculum_by_id
*/
exports.get_inoculum_by_id = async (req, res) => {
    const { id_inoculo } = req.query;
    try {
        if (!id_inoculo) {
            return res.status(400).json({ success: false, message: "ID de inóculo requerido" });
        }

        const inoculo = await Inoculo.fetch_by_id(id_inoculo);
        
        if (!inoculo) {
            return res.status(404).json({ success: false, message: "Inóculo no encontrado" });
        }

        res.status(200).json({ success: true, data: inoculo });
    } catch (error) {
        console.error("Error en get_inoculum_by_id:", error);
        res.status(500).json({ success: false, message: "Error al obtener el inóculo", error: error.message });
    }
};

exports.get_notas_inoculo_by_id = async (req, res) => {
    try {
        const { id_inoculo } = req.params;
        const notas = await Inoculo.fetch_notas_inoculo_by_id(id_inoculo);
        res.status(200).json({ success: true, data: notas });
    } catch (err) {
        console.error("Error en get_notas_inoculo_by_id controller: ", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.post_nota_inoculo = async (req, res) => {
    try {
        const { id_inoculo, fecha, notas_bitacora } = req.body;
        await Inoculo.post_nota_inoculo(id_inoculo, fecha, notas_bitacora);
        res.status(200).json({ success: true, message: "Nota de inóculo creada correctamente" });
    } catch (err) {
        console.error("Error en post_nota_inoculo:", err);
        res.status(500).json({ success: false, message: "Error al guardar la nota" });
    }
};
// backend/controllers/inoculo.controller.js
const Inoculo = require('../models/inoculo.model');

exports.get_especies = async (req, res, next) => {
    try {
        const [especies] = await Inoculo.fetchEspecies();

        res.status(200).json({
            success: true,
            data: especies
        });

    } catch (error) {
        console.error('Error al obtener especies:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las especies'
        });
    }
};

/** Obtiene los inóculos de una especie y tipo específicos
 * @param {string} especie - El nombre de la especie (por defecto es 'Shiitake').
 * @param {string} tipo - El tipo del inóculo (por defecto es 'Agar').
 */
exports.get_inoculos_filtrados = async (req, res, next) => {
    try {
        const especie = req.query.especie || 'Shiitake';
        const tipo = req.query.tipo || 'Agar';

        const [inoculos] = await Inoculo.fetchInoculosFiltrados(especie, tipo);

        res.status(200).json({
            success: true,
            data: inoculos
        });
    } catch (error) {
        console.error('Error al obtener inóculos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los inóculos'
        });
    }
};

exports.get_inoculos = async (req, res, next) => {
    try {
        const [inoculos] = await Inoculo.fetchInoculos();

        res.status(200).json({
            success: true,
            data: inoculos
        });
    } catch (error) {
        console.error('Error al obtener inóculos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los inóculos'
        });
    }
};

exports.get_cantidad_ingredientes = async (req, res, next) => {
    try {
        const [cantidad] = await Inoculo.fetchCantidadIngredientes();   
        res.status(200).json({
            success: true,
            data: cantidad
        });
    } catch (error) {
        console.error('Error al obtener cantidad de ingredientes:', error);
        res.status(500).json({  
            success: false,
            message: 'Error al obtener la cantidad de ingredientes'
        });
    }
};

exports.post_crear_inoculo = async (req, res, next) => {
  // ── validaciones antes de tocar la BD ──────────────────────
    const {
        codigo_fungivora,
        tipo,
        especie,
        fecha,
        cantidad_disponible,
        nota,
        unidad,
        stock_recomendado,
        inoculo_usado,  // { id, cantidad }
        ingredientes  //    [ { id, cantidad }, ... ]
    } = req.body

    const db = require('../util/db');

    const connection = await db.getConnection();

    // ── Abre la transacción ─────────────────────────────────────
    await connection.beginTransaction()

    try {

        // 1 — inserta el inóculo
        const inoculoId = await Inoculo.insertInoculo({
        id_inoculo_usado: inoculo_usado.id,
        cantidad_usada: inoculo_usado.cantidad,
        codigo_fungivora,
        tipo,
        especie,
        fecha,
        cantidad_disponible,
        unidad,
        stock_recomendado
        }, connection)
        // connection se pasa para que este INSERT
        // forme parte de la misma transacción

        // 2 — inserta una fila por cada ingrediente
        // el for..of espera a que cada INSERT termine
        // antes de pasar al siguiente
        for (const ingrediente of ingredientes) {
            await Inoculo.insertIngrediente({
                inoculoId,             // id que devolvió el paso 1
                ingredienteId: ingrediente.id,
                cantidad:      ingrediente.cantidad
            }, connection)
        }

        // 3 — registra en bitácora
        await Inoculo.insertBitacora({
        inoculoId,
        fecha,
        nota
        }, connection)

        // 4 — descuenta el stock de cada insumo
        // si alguno no tiene stock suficiente el model
        // lanza throw new Error('STOCK_INSUFICIENTE')
        // y salta directo al catch
        for (const ingrediente of ingredientes) {
            await Inoculo.updateInsumo({
                ingredienteId: ingrediente.id,
                cantidad:      ingrediente.cantidad
            }, connection)
        }

        await Inoculo.updateInoculo({
            id: inoculoId,
            cantidad_disponible: cantidad_disponible
        }, connection)

        // 5 — registra un log de salida por cada ingrediente
        for (const ingrediente of ingredientes) {
        await Inoculo.insertLog({
            ingredienteId: ingrediente.id,
            cantidad:      ingrediente.cantidad,
            fecha,
            tipo:          'Out'
        }, connection)
        }

        // ── todo salió bien — confirma los cambios en la BD ────────
        // sin este COMMIT ningún cambio se persiste
        await connection.commit(connection)

        res.status(201).json({
        success: true,
        message: 'Inóculo creado exitosamente'
        })

    } catch (error) {

        // ── algo falló — deshace TODO lo que se hizo arriba ────────
        // si el INSERT de Inoculos ya ocurrió pero updateInsumo falló,
        // el rollback borra también ese INSERT
        await connection.rollback(connection)

        if (error.message === 'STOCK_INSUFICIENTE') {
        return res.status(422).json({
            success: false,
            message: 'Stock insuficiente para uno o más ingredientes'
        })
        }

        // cualquier otro error inesperado lo maneja el middleware global
        next(error)
    };
}
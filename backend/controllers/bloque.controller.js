const Bloque = require('../models/bloque.model');
const Categoria = require('../models/categoria.model');
const crypto = require('crypto');

/**
 * get_bloques_por_lote
 * Obtener la información de los bloques de un lote
 * Metodo que hace una llamada al modelo para obtener la info necesaria
 * @param {*} req 
 * @param {*} res 
 */
exports.get_bloques_por_lote = async (req, res) => {
    try {
        const { id_lote } = req.query;
        const bloques = await Bloque.fetch_por_lote(id_lote);

        res.status(200).json({
            success: true,
            data: bloques
        });

    } catch (err) {
        console.error("Error en get_bloques_por_lote controller:", err);

        res.status(500).json({
            success: false,
            message: "Hubo un error al recuperar los bloques",
            error: err.message
        });
    }
};

exports.toggle_contaminado = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: "Debes enviar un array de ids"
            });
        }

        const resultados = await Promise.all(
            ids.map(id => Bloque.toggle_contaminado(id))
        );

        res.status(200).json({
            success: true,
            data: resultados
        });

    } catch (err) {
        console.error("Error en toggle_contaminado controller:", err);

        res.status(500).json({
            success: false,
            message: "Hubo un error al actualizar los bloques",
            error: err.message
        });
    }
}


exports.post_bloques = async (req, res) => {
    try {
        const { id_lote, produccion, peso_gr, contenedor, cantidad } = req.body;

        // Validaciones básicas
        if (!id_lote || !cantidad || cantidad <= 0) {
            return res.status(400).json({ success: false, message: "Datos incompletos o cantidad inválida" });
        }

        const promesas = [];
        const bloquesGenerados = [];

        for (let i = 0; i < cantidad; i++) {
            const nuevoBloque = {
                id_bloque: crypto.randomUUID(),
                id_lote: id_lote,
                produccion: produccion || 1,
                peso_gr: peso_gr || 0,
                contaminado: 0,
                contenedor: contenedor
            };
            
            bloquesGenerados.push(nuevoBloque.id_bloque);
            promesas.push(Bloque.crear_bloque(nuevoBloque));
        }

        await Promise.all(promesas);

        res.status(201).json({
            success: true,
            message: `${cantidad} bloques creados exitosamente`,
            ids: bloquesGenerados
        });

    } catch (err) {
        console.error("Error en post_bloques controller:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Auxiliar para llenar el select de contenedores en el front
exports.get_contenedores = async (req, res) => {
    try {
        const [contenedores] = await Categoria.fetchOpciones('Contenedor', false);
        res.status(200).json(contenedores);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener contenedores' });
    }
};

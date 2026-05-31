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

/**
 * Actualización masiva de bloques de un lote
 * Permite actualizar múltiples bloques de un lote en una sola operación
 * @param {string} id_lote - El ID del lote al que pertenecen los bloques
 * @param {Array} bloques - Un array de objetos con la información de los bloques a actualizar
 */
exports.actualizar_bloques_masivo = async (req, res) => {
    try {
        const { id_lote } = req.query;
        const { bloques } = req.body;
        await Bloque.actualizar_bloques_masivo(id_lote, bloques);

        res.status(200).json({
            success: true,
            message: 'Bloques del lote actualizados con éxito'
        });
    } catch (error) {
        console.error("Error en actualizar_bloques_masivo controller:", error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar los bloques del lote'
        });
    }
}

/*
* get_sustratos
* Obtiene todas los sustratos de la tabla de categorias
* Funciona al tener el fetch por 'Sustrato'
*/
exports.get_sustratos = async (req, res) => {
    try {
        const [sustratos] = await Categoria.fetchOpciones('Sustrato', false);
        res.status(200).json(sustratos);
    } catch {
        res.status(500).json({ success: false, error: 'Error al obtener sustratos' });
    }
};

/**
 * post_bloques
 * Registra un nuevo bloque ligado un lote incluyendo su tipo de sustrato
 * Metodo que hace un insert con la información de los bloques
 * @param {*} req 
 * @param {*} res 
 */
exports.post_bloques = async (req, res) => {
    try {
        const { id_lote, produccion, peso_gr, contenedor, cantidad, tipo_sustrato } = req.body;

        if (!produccion || !id_lote || !cantidad || cantidad <= 0) {
            return res.status(400).json({ success: false, message: "Datos incompletos o cantidad inválida" });
        }

        const data = [];
        const bloquesGenerados = [];

        for (let i = 0; i < cantidad; i++) {
            const nuevoBloque = {
                id_bloque: crypto.randomUUID(),
                id_lote: id_lote,
                produccion: produccion,
                peso_gr: peso_gr || 0,
                contaminado: 0,
                contenedor: contenedor,
                tipo_sustrato: tipo_sustrato 
            };

            bloquesGenerados.push(nuevoBloque.id_bloque);
            data.push(Bloque.crear_bloque(nuevoBloque));
        }

        await Promise.all(data);

        res.status(201).json({
            success: true,
            ids: bloquesGenerados
        });

    } catch (err) {
        console.error("Error en post_bloques controller:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

/*
* get_contenedores
* Obtiene todas los contenedoress de la tabla de categorias
* Funciona al tener el fetch por 'Contenedor'
*/
exports.get_contenedores = async (req, res) => {
    try {
        const [contenedores] = await Categoria.fetchOpciones('Contenedor', false);
        res.status(200).json(contenedores);
    } catch {
        res.status(500).json({ success: false, error: 'Error al obtener contenedores' });
    }
};

exports.get_notas_by_id = async (req, res) => {
    try {
        const { id_bloque } = req.params;
        const notas = await Bloque.fetch_notas_by_id(id_bloque);
        res.status(200).json(notas);
    } catch (err) {
        console.error ("Error en get_notas_by_id controller: ", err);
        res.status(500).json({ success: false, error: err.message})
    }
}
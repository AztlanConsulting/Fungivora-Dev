const Lotes = require('../models/lotes.model');
const Categoria = require('../models/categoria.model');
const Bloque = require('../models/bloque.model');
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
        // Request de los datos
        const { ubicacion_lote, tipo_sustrato, id_inoculo, fecha_lote, bloques, produccion } = req.body;

        // Recuperar los inculos
        const inoculos = await Lotes.fetch_inoculos_disponibles();
        const inoculoSeleccionado = inoculos.find(i => i.id_inoculo == id_inoculo);

        if (!inoculoSeleccionado) {
            return res.status(400).json({ success: false, message: "Inóculo no encontrado" });
        }

        // Generación del código

        // Abreviatura del inoculo
        const [abreviaturaResult] = await Categoria.fetchAbreviaturaPorNombre(inoculoSeleccionado.especie);
        const abreviatura = abreviaturaResult[0].abreviatura_opcion;

        // Fecha para el código
        const fechaParaCodigo = new Date(fecha_lote);
        const dd = String(fechaParaCodigo.getUTCDate()).padStart(2, '0');
        const mm = String(fechaParaCodigo.getUTCMonth() + 1).padStart(2, '0');
        const yy = fechaParaCodigo.getUTCFullYear().toString().slice(-2);
        const fechaStr = `${dd}${mm}${yy}`;

        // Forma inicial del código
        const prefijoBase = `LC-${abreviatura}-${fechaStr}`;

        // Contar cuantos lotes hay con dicho prefijo
        const cantidadGrupo = await Lotes.count_lotes_similares(prefijoBase);
        const nuevoNumero = cantidadGrupo + 1;

        // Código completo
        const codigo_fungivora = `${prefijoBase}-${nuevoNumero}`;

        const id_lote = crypto.randomUUID();

        // Crear el lote
        await Lotes.crear_lote(
            id_lote,
            id_inoculo,
            tipo_sustrato,
            codigo_fungivora,
            fecha_lote,
            ubicacion_lote,
            1, // activo
            "Inoculación" // fase por default
        );

        // Crear bloques con la relación
        if (bloques && Array.isArray(bloques)) {
            const promesasBloques = [];

            // Ciclos para tener tantos bloques como estos sean añadidos
            for (const b of bloques) {
                const numBloques = Number(b.cantidad) || 1;
                
                for (let i = 0; i < numBloques; i++) {
                    promesasBloques.push(
                        Bloque.crear_bloque({
                            id_bloque: crypto.randomUUID(),
                            id_lote: id_lote,
                            produccion: (b.produccion !== undefined) ? b.produccion : produccion,
                            peso_gr: b.peso_gr || 0,
                            contaminado: 0,
                            contenedor: b.contenedor
                        })
                    );
                }
            }
            await Promise.all(promesasBloques);
        }

        res.status(201).json({
            success: true,
            codigo: codigo_fungivora,
            id: id_lote
        });

    } catch (error) {
        console.error("Error en post_batch:", error);
        res.status(500).json({ success: false, error: 'Error interno' });
    }
};

/**
 * Actualizar Fase del Lote
 * Permite actualizar la fase de un lote específico
 * @param {string} id_lote - El ID del lote a actualizar
 * @param {string} nuevaFase - La nueva fase a asignar al lote
 */
exports.actualizar_fase = async (req, res) => {
    try {
        const { id_lote } = req.query;
        const { nuevaFase } = req.body;
        await Lotes.actualizar_fase(id_lote, nuevaFase);

        res.status(200).json({
            success: true,
            message: 'Fase del lote actualizada con éxito'
        });
    } catch (error) {
        console.error("Error en actualizar_fase controller:", error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la fase del lote'
        });
    }
};

/**
 * Obtener el lote por el id
 * Permite encontrar el id del lote seleccionado
 * @param {string} id_lote - El ID del lote 
 */
exports.get_batch_by_id = async (req, res) => {
    const { id_lote } = req.query;
    try {
        const lote = await Lote.findOne({ where: { id_lote: id_lote } }); 
        res.json(lote);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Obtener las especies y luego el inoculo
 * Permite encontrar las especies relacionadas con los inóculos
 * @param {string} inoculos - Los inoculos en la base
 */
exports.get_especies_unicas = async (req, res) => {
    try {
        const inoculos = await Lotes.fetch_inoculos_disponibles();
        
        // Especies sin repetir
        const especiesUnicas = [...new Set(inoculos.map(i => i.especie))];

        res.status(200).json({
            success: true,
            data: especiesUnicas
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener especies' });
    }
};
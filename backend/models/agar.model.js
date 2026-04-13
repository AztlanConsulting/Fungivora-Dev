const { randomUUID } = require('crypto');
const db = require('../util/db');

class Agar {
    constructor(id_micelio_sustrato, id_resultado, id_herencia, id_usuario, foto_ms, notas_ms, rendimiento) {
        this.id_micelio_sustrato = id_micelio_sustrato;
        this.id_resultado        = id_resultado;
        this.id_herencia         = id_herencia;
        this.id_usuario          = id_usuario;
        this.foto_ms             = foto_ms;
        this.notas_ms            = notas_ms;
        this.rendimiento         = rendimiento;
    }

    static fetch_all_agars = async () => {
        const [filas] = await db.execute(`
            SELECT i.id_inventario, i.nombre_inventario, i.unidad_medida, i.id_categoria
            FROM inventario i
            INNER JOIN categorias c ON i.id_categoria = c.id_categoria
            WHERE c.nombre_categoria = 'agar'
        `);
        return filas;
    };

    static fetch_all_granos = async () => {
        const [filas] = await db.execute(`
            SELECT i.id_inventario, i.nombre_inventario, i.unidad_medida
            FROM inventario i
            INNER JOIN categorias c ON i.id_categoria = c.id_categoria
            WHERE c.nombre_categoria = 'Grano'
        `);
        return filas;
    };

    /*
    * anadir
    Registrar un nuevo agar en la base de datos
    Inserta en inventario, micelio_sustrato, in_outs e ingredientes
    @param id_herencia, nombre_inventario, rendimiento,
           unidad_medida, tipoGrano, cantidadGrano, notas, foto
    */
    static anadir = async ({
        id_herencia,
        nombre_inventario,
        rendimiento,
        unidad_medida,
        tipoGrano,
        cantidadGrano,
        notas,
        foto
    }) => {
        const new_id_inventario      = randomUUID();
        const new_id_micelio_sustrato = randomUUID();
        const id_usuario_hardcoded   = 'u1-11111111-1111-1111-111111111111'; // TODO: req.user.id

        // Obtener id_categoria de agar desde la DB
        const [[categoria]] = await db.execute(`
            SELECT id_categoria FROM categorias WHERE nombre_categoria = 'agar'
        `);

        // 1. INSERT inventario — el nuevo lote de agar creado
        await db.execute(`
            INSERT INTO inventario (id_inventario, id_categoria, nombre_inventario, cantidad_inventario, unidad_medida, es_manufacturado)
            VALUES (?, ?, ?, ?, ?, 1)
        `, [
            new_id_inventario,
            categoria.id_categoria,
            nombre_inventario,
            parseFloat(rendimiento),
            unidad_medida,
        ]);

        // 2. INSERT micelio_sustrato — registro del proceso
        await db.execute(`
            INSERT INTO micelio_sustrato (id_micelio_sustrato, id_resultado, id_herencia, id_usuario, foto_ms, notas_ms, rendimiento, tipo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            new_id_micelio_sustrato,
            new_id_inventario,
            id_herencia,
            id_usuario_hardcoded,
            foto  || null,
            notas || null,
            parseFloat(rendimiento),
            'agar',
        ]);

        // 3. INSERT in_outs — salida del grano consumido
        await db.execute(`
            INSERT INTO in_outs (id_in_outs, id_usuario, id_inventario, cantidad_in_outs, tipo_movimiento)
            VALUES (?, ?, ?, ?, 0)
        `, [
            randomUUID(),
            id_usuario_hardcoded,
            tipoGrano,
            parseFloat(cantidadGrano),
        ]);

        // 4. INSERT ingredientes — grano como ingrediente del nuevo lote
        await db.execute(`
            INSERT INTO ingredientes (id_micelio_sustrato, id_ingrediente, cantidad_usada)
            VALUES (?, ?, ?)
        `, [
            new_id_micelio_sustrato,
            tipoGrano,
            parseFloat(cantidadGrano),
        ]);

        return new_id_inventario;
    };
}

module.exports = Agar;
const { randomUUID } = require('crypto');
const db = require('../util/db');
//Creaccion del registro de la db via fetchs, constructores y inserciones
class Semilla {
    //Constructor que paso los datos de la db a la vista
    constructor(id_micelio_sustrato, id_resultado, id_herencia, id_usuario, foto_ms, notas_ms, rendimiento) {
        this.id_micelio_sustrato = id_micelio_sustrato;
        this.id_resultado        = id_resultado;
        this.id_herencia         = id_herencia;
        this.id_usuario          = id_usuario;
        this.foto_ms             = foto_ms;
        this.notas_ms            = notas_ms;
        this.rendimiento         = rendimiento;
    }
    //metodos fetch pára armar los selects
    static fetch_all_semillas = async () => {
        const [filas] = await db.execute(`
            SELECT i.id_inventario, i.nombre_inventario, i.unidad_medida, i.id_categoria
            FROM inventario i
            INNER JOIN categorias c ON i.id_categoria = c.id_categoria
            WHERE c.nombre_categoria = 'semilla'
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

    static fetch_all_micelios = async () => {
        const [filas] = await db.execute(`
            SELECT i.id_inventario, i.nombre_inventario, i.unidad_medida
            FROM inventario i
            INNER JOIN categorias c ON i.id_categoria = c.id_categoria
            WHERE c.nombre_categoria = 'micelio'
        `);
        return filas;
    };

    /*
    * anadir
    Registrar una nueva semilla en la base de datos con metodos de insercion
    Inserta en inventario, micelio_sustrato, in_outs e ingredientes
    @param id_herencia, nombre_inventario, rendimiento,
           unidad_medida, tipoGrano, cantidadGrano, micelio, cantidadMicelio, notas, foto
    */
    static anadir = async ({
        id_herencia,
        nombre_inventario,
        rendimiento,
        unidad_medida,
        tipoGrano,
        cantidadGrano,
        micelio,
        cantidadMicelio,
        notas,
        foto
    }) => {
        const new_id_inventario      = randomUUID();
        const new_id_micelio_sustrato = randomUUID();
        const id_usuario_hardcoded   = 'u1-11111111-1111-1111-111111111111'; // TODO: req.user.id — reemplazar con el id del usuario autenticado,requiere implementar middeleware

        // Obtener id_categoria de semilla desde la DB
        const [[categoria]] = await db.execute(`
            SELECT id_categoria FROM categorias WHERE nombre_categoria = 'semilla'
        `);

        //INSERT inventario — el nuevo lote de semilla creado
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

        //INSERT micelio_sustrato — registro del proceso
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
            'semilla',
        ]);

        //INSERT in_outs — salida del grano consumido
        await db.execute(`
            INSERT INTO in_outs (id_in_outs, id_usuario, id_inventario, cantidad_in_outs, tipo_movimiento)
            VALUES (?, ?, ?, ?, 0)
        `, [
            randomUUID(),
            id_usuario_hardcoded,
            tipoGrano,
            parseFloat(cantidadGrano),
        ]);

        //INSERT ingredientes — grano como ingrediente del nuevo lote
        await db.execute(`
            INSERT INTO ingredientes (id_micelio_sustrato, id_ingrediente, cantidad_usada)
            VALUES (?, ?, ?)
        `, [
            new_id_micelio_sustrato,
            tipoGrano,
            parseFloat(cantidadGrano),
        ]);

        //INSERT in_outs — salida del micelio consumido
        await db.execute(`
            INSERT INTO in_outs (id_in_outs, id_usuario, id_inventario, cantidad_in_outs, tipo_movimiento)
            VALUES (?, ?, ?, ?, 0)
        `, [
            randomUUID(),
            id_usuario_hardcoded,
            micelio,
            parseFloat(cantidadMicelio),
        ]);

        //INSERT ingredientes — micelio como ingrediente del nuevo lote
        await db.execute(`
            INSERT INTO ingredientes (id_micelio_sustrato, id_ingrediente, cantidad_usada)
            VALUES (?, ?, ?)
        `, [
            new_id_micelio_sustrato,
            micelio,
            parseFloat(cantidadMicelio),
        ]);

        return new_id_inventario;
    };
}

module.exports = Semilla;
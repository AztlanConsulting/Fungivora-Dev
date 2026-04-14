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
            WHERE LOWER(c.nombre_categoria) = 'semilla'
        `);
        return filas;
    };

    static fetch_all_granos = async () => {
        const [filas] = await db.execute(`
            SELECT i.id_inventario, i.nombre_inventario, i.unidad_medida
            FROM inventario i
            INNER JOIN categorias c ON i.id_categoria = c.id_categoria
            WHERE LOWER(c.nombre_categoria) = 'grano'
            
        `);
        return filas;
    };

    static fetch_all_micelios = async () => {
        const [filas] = await db.execute(`
            SELECT i.id_inventario, i.nombre_inventario, i.unidad_medida
            FROM inventario i
            INNER JOIN categorias c ON i.id_categoria = c.id_categoria
            WHERE LOWER(c.nombre_categoria) = 'micelio'
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
        foto,
        id_usuario,
    }) => {
        const new_id_inventario      = randomUUID();
        const new_id_micelio_sustrato = randomUUID();

        // Obtener id_categoria de semilla desde la DB
        const [[categoria]] = await db.execute(`
            SELECT id_categoria FROM categorias WHERE LOWER(nombre_categoria) = 'semilla'
        `);

        //la nueva semilla creado en el inventario
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
            INSERT INTO micelio_sustrato (id_micelio_sustrato, id_resultado, id_herencia, id_usuario, foto_ms, notas_ms)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            new_id_micelio_sustrato,
            new_id_inventario,
            id_herencia,
            id_usuario,
            foto  || null,
            notas || null,
        ]);

        //INSERT in_outs — salida del grano consumido
        await db.execute(`
            INSERT INTO in_outs (id_in_outs, id_usuario, id_inventario, cantidad_in_outs, tipo_movimiento)
            VALUES (?, ?, ?, ?, ?)
        `, [
            randomUUID(),
            id_usuario,
            tipoGrano,
            parseFloat(cantidadGrano),
            0,
        ]);

        //Update para descontar del inventario lo consumido
        await db.execute(`
            UPDATE inventario
            SET cantidad_inventario = cantidad_inventario - ?
            WHERE id_inventario = ?
        `, [
            parseFloat(cantidadGrano),
            tipoGrano,
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
            VALUES (?, ?, ?, ?, ?)
        `, [
            randomUUID(),
            id_usuario,
            micelio,
            parseFloat(cantidadMicelio),
            0,
        ]);

        //Update para descontar del inventario lo consumido
        await db.execute(`
            UPDATE inventario
            SET cantidad_inventario = cantidad_inventario - ?
            WHERE id_inventario = ?
        `, [
            parseFloat(cantidadMicelio),
            micelio,
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
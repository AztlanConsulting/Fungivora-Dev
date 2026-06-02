/**
 * testDb.js
 * Provides a real MySQL2 connection pool for model integration tests.
 *
 * Requires these env vars (e.g. in .env.test):
 *   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (a dedicated test database), DB_PORT
 *
 * The helpers exposed here seed minimal data before each test and clean up
 * after, so tests stay isolated and order-independent.
 */

'use strict';

const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

// Load .env.test.local if present, falling back to the project .env
dotenv.config({ quiet: true, path: path.resolve(__dirname, '../../../../.env.test.local') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 5,
});

const db = pool.promise();

// Seed helpers 

/**
 * Inserts a Categoria row (INSERT IGNORE to be idempotent across test runs).
 */
async function seedCategoria({
    nombre_categoria = 'Especies',
    nombre_opcion = 'Shiitake',
    abreviatura_opcion = 'SH',
} = {}) {
    await db.execute(
        `INSERT IGNORE INTO Categorias (nombre_categoria, nombre_opcion, abreviatura_opcion)
         VALUES (?, ?, ?)`,
        [nombre_categoria, nombre_opcion, abreviatura_opcion]
    );
}

/**
 * Inserts an Inoculo row and returns its auto-generated id.
 */
async function seedInoculo({
    codigo_fungivora = `TEST-INO-${crypto.randomUUID()}`,
    tipo = 'semilla',
    especie = 'Shiitake',
    fecha = '2024-01-01',
    cantidad_disponible = 10,
    unidad = 'Pieza(s)',
    stock_recomendado = 5,
    id_inoculo_usado = null,
    cantidad_usada = null,
} = {}) {
    const [result] = await db.execute(
        `INSERT INTO Inoculos
            (id_inoculo_usado, cantidad_usada, codigo_fungivora, tipo, especie,
             fecha, cantidad_disponible, unidad, stock_recomendado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_inoculo_usado, cantidad_usada, codigo_fungivora, tipo, especie,
            fecha, cantidad_disponible, unidad, stock_recomendado]
    );
    return result.insertId;
}

/**
 * Inserts an Insumo row and returns its id.
 * id_insumo has no AUTO_INCREMENT — always pass a UUID.
 */
async function seedInsumo({
    id_insumo = crypto.randomUUID(),
    nombre = 'Agua Destilada',
    cantidad = 100,
    unidad = 'Mililitro(s)',
    stock_recomendado = 50,
} = {}) {
    await db.execute(
        `INSERT INTO Insumos (id_insumo, nombre, cantidad, unidad, stock_recomendado)
         VALUES (?, ?, ?, ?, ?)`,
        [id_insumo, nombre, cantidad, unidad, stock_recomendado]
    );
    return id_insumo;
}

/**
 * Inserts a Lote row and returns its id.
 */
async function seedLote({
    id_lote = crypto.randomUUID(),
    codigo_fungivora = 'LC-TEST-010125-1',
    fecha_lote = '2025-01-01',
    ubicacion_lote = 'Rack A',
    activo = 1,
    fase = 'Inoculación',
} = {}) {
    await db.execute(
        `INSERT INTO Lotes (id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_lote, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase]
    );
    return id_lote;
}

/**
 * Inserts a Bloque row and returns its id.
 * produccion is TINYINT: 1 = producción, 0 = experimental.
 */
async function seedBloque({
    id_bloque = crypto.randomUUID(),
    id_lote,
    id_inoculo,
    produccion = 1,
    peso_gr = 500,
    contaminado = 0,
    contenedor = 'Bolsa',
    tipo_sustrato = 'Paja',
} = {}) {
    await db.execute(
        `INSERT INTO Bloques
            (id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato]
    );
    return id_bloque;
}

/**
 * Inserts a Usuario row and returns its auto-generated id.
 * estatus_usuario is TINYINT: 1 = activo, 0 = inactivo.
 */
async function seedUsuario({
    nombre_usuario = `testuser_${crypto.randomUUID().slice(0, 8)}`,
    correo_usuario = 'test@fungivora.test',
    contrasena_usuario = '$2b$10$hashedpassword',
    estatus_usuario = 1,      // TINYINT — NOT 'Activo'
    is_user_admin = 0,
} = {}) {
    const [result] = await db.execute(
        `INSERT INTO Usuarios
            (nombre_usuario, correo_usuario, contrasena_usuario, estatus_usuario, is_user_admin)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre_usuario, correo_usuario, contrasena_usuario, estatus_usuario, is_user_admin]
    );
    return result.insertId;
}

// Cleanup 

/**
 * Deletes test data inserted during a test run, in FK-safe order.
 */
async function cleanup({
    loteIds = [],
    inoculoIds = [],
    insumoIds = [],
    usuarioIds = [],
    prefijo = null,
} = {}) {
    if (loteIds.length) {
        const ph = loteIds.map(() => '?').join(',');
        await db.execute(`DELETE FROM Bloques WHERE id_lote IN (${ph})`, loteIds);
        await db.execute(`DELETE FROM Lotes   WHERE id_lote IN (${ph})`, loteIds);
    }
    if (inoculoIds.length) {
        const ph = inoculoIds.map(() => '?').join(',');
        await db.execute(`DELETE FROM Ingredientes      WHERE id_inoculo_creado IN (${ph})`, inoculoIds);
        await db.execute(`DELETE FROM Bitacora_inoculos WHERE id_inoculo        IN (${ph})`, inoculoIds);
        await db.execute(`DELETE FROM Inoculos          WHERE id_inoculo        IN (${ph})`, inoculoIds);
    }
    if (insumoIds.length) {
        const ph = insumoIds.map(() => '?').join(',');
        await db.execute(`DELETE FROM Logs_ins_outs WHERE id_insumo IN (${ph})`, insumoIds);
        await db.execute(`DELETE FROM Insumos       WHERE id_insumo IN (${ph})`, insumoIds);
    }
    if (usuarioIds.length) {
        const ph = usuarioIds.map(() => '?').join(',');
        await db.execute(`DELETE FROM Usuarios WHERE id_usuario IN (${ph})`, usuarioIds);
    }
    if (prefijo) {
        await db.execute(
            `DELETE FROM Bloques WHERE id_lote IN (SELECT id_lote FROM Lotes WHERE codigo_fungivora LIKE ?)`,
            [`${prefijo}%`]
        );
        await db.execute(`DELETE FROM Lotes    WHERE codigo_fungivora LIKE ?`, [`${prefijo}%`]);
        await db.execute(`DELETE FROM Inoculos WHERE codigo_fungivora LIKE ?`, [`${prefijo}%`]);
    }
}

async function closePool() {
    await db.end();
}

module.exports = {
    db,
    seedCategoria,
    seedInoculo,
    seedInsumo,
    seedLote,
    seedBloque,
    seedUsuario,
    cleanup,
    closePool,
};
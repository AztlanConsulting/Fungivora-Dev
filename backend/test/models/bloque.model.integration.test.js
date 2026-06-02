/**
 * @file bloque.model.integration.test.js
 * Real-database integration tests for backend/models/bloque.model.js
 *
 * Requires a running MySQL/MariaDB instance pointed to by DB_* env vars.
 * All seeded data is deleted in afterEach to keep tests isolated.
 */

'use strict';

// Point the model at the test pool (override require cache before loading the model)
jest.mock('../../util/db', () => require('./helpers/testDb').db);

const Bloque = require('../../models/bloque.model');
const { seedCategoria, seedInoculo, seedLote, seedBloque, cleanup, closePool } = require('./helpers/testDb');
const crypto = require('crypto');

// IDs created per-test, cleared in afterEach
let state = {};

beforeAll(async () => {
    await seedCategoria({ nombre_categoria: 'Especies', nombre_opcion: 'Shiitake', abreviatura_opcion: 'SH' });
});

beforeEach(() => {
    state = { loteIds: [], inoculoIds: [] };
});

afterEach(async () => {
    await cleanup(state);
});

afterAll(async () => {
    await closePool();
});

// Helpers 

async function crearLoteConInoculo() {
    const inoculoId = await seedInoculo({ tipo: 'semilla', especie: 'Shiitake' });
    const loteId = await seedLote();
    state.inoculoIds.push(inoculoId);
    state.loteIds.push(loteId);
    return { inoculoId, loteId };
}

// fetch_por_lote

describe('Bloque.fetch_por_lote', () => {
    test('retorna los bloques del lote con joins a Lotes e Inoculos', async () => {
        const { inoculoId, loteId } = await crearLoteConInoculo();
        const bloqueId = await seedBloque({ id_lote: loteId, id_inoculo: inoculoId });

        const filas = await Bloque.fetch_por_lote(loteId);

        expect(Array.isArray(filas)).toBe(true);
        expect(filas.length).toBeGreaterThanOrEqual(1);

        const bloque = filas.find(b => b.id_bloque === bloqueId);
        expect(bloque).toBeDefined();
        expect(bloque).toMatchObject({
            id_lote: loteId,
            id_inoculo: inoculoId,
        });
        // Joined columns
        expect(bloque).toHaveProperty('codigo_inoculo_bloque');
        expect(bloque).toHaveProperty('especie_nombre');
        expect(bloque).toHaveProperty('codigo_lote_padre');
    });

    test('retorna arreglo vacío cuando el lote no tiene bloques', async () => {
        const loteId = await seedLote({ id_lote: crypto.randomUUID(), codigo_fungivora: 'LC-EMPTY-010125-1' });
        state.loteIds.push(loteId);

        const filas = await Bloque.fetch_por_lote(loteId);
        expect(filas).toEqual([]);
    });

    test('retorna bloques ordenados por id_bloque DESC (múltiples bloques)', async () => {
        const { inoculoId, loteId } = await crearLoteConInoculo();
        const b1 = await seedBloque({ id_lote: loteId, id_inoculo: inoculoId, peso_gr: 100 });
        const b2 = await seedBloque({ id_lote: loteId, id_inoculo: inoculoId, peso_gr: 200 });

        const filas = await Bloque.fetch_por_lote(loteId);
        const ids = filas.map(b => b.id_bloque);

        // El bloque más reciente debe aparecer primero (ORDER BY id_bloque DESC)
        const posB1 = ids.indexOf(b1);
        const posB2 = ids.indexOf(b2);
        // b2 was inserted after b1 so it should come first
        expect(posB2).toBeLessThan(posB1);
    });

    test('lanza error (throw) si el id_lote provoca un fallo en la DB', async () => {
        // Pass an object — mysql2 will reject the parameterized query
        await expect(Bloque.fetch_por_lote({ invalid: true })).rejects.toThrow();
    });
});

// crear_bloque

describe('Bloque.crear_bloque', () => {
    test('inserta un bloque nuevo y es recuperable por fetch_por_lote', async () => {
        const { inoculoId, loteId } = await crearLoteConInoculo();
        const id_bloque = crypto.randomUUID();

        await Bloque.crear_bloque({
            id_bloque,
            id_lote: loteId,
            id_inoculo: inoculoId,
            produccion: 1,
            peso_gr: 750,
            contaminado: 0,
            contenedor: 'Bolsa',
            tipo_sustrato: 'Paja',
        });

        const filas = await Bloque.fetch_por_lote(loteId);
        const bloque = filas.find(b => b.id_bloque === id_bloque);

        expect(bloque).toBeDefined();
        expect(Number(bloque.peso_gr)).toBe(750);
        expect(bloque.contenedor).toBe('Bolsa');
        expect(bloque.tipo_sustrato).toBe('Paja');
    });

    test('lanza error si falta un campo NOT NULL requerido', async () => {
        await expect(
            Bloque.crear_bloque({ id_bloque: crypto.randomUUID() /* missing fields */ })
        ).rejects.toThrow();
    });

    test('lanza error si id_lote no existe (FK violation)', async () => {
        const inoculoId = await seedInoculo();
        state.inoculoIds.push(inoculoId);

        await expect(
            Bloque.crear_bloque({
                id_bloque: crypto.randomUUID(),
                id_lote: 'UUID-QUE-NO-EXISTE',
                id_inoculo: inoculoId,
                produccion: 1,
                peso_gr: 0,
                contaminado: 0,
                contenedor: 'Bolsa',
                tipo_sustrato: 'Paja',
            })
        ).rejects.toThrow();
    });
});

// actualizar_bloques_masivo

describe('Bloque.actualizar_bloques_masivo', () => {
    test('actualiza el campo contaminado de múltiples bloques en una sola transacción', async () => {
        const { inoculoId, loteId } = await crearLoteConInoculo();
        const b1 = await seedBloque({ id_lote: loteId, id_inoculo: inoculoId, contaminado: 0 });
        const b2 = await seedBloque({ id_lote: loteId, id_inoculo: inoculoId, contaminado: 0 });

        await Bloque.actualizar_bloques_masivo(loteId, [
            { id_bloque: b1, contaminado: 1 },
            { id_bloque: b2, contaminado: 0 },
        ]);

        const filas = await Bloque.fetch_por_lote(loteId);
        const bloqueB1 = filas.find(b => b.id_bloque === b1);
        const bloqueB2 = filas.find(b => b.id_bloque === b2);

        expect(Number(bloqueB1.contaminado)).toBe(1);
        expect(Number(bloqueB2.contaminado)).toBe(0);
    });

    test('no afecta bloques de otros lotes', async () => {
        const { inoculoId, loteId } = await crearLoteConInoculo();
        const loteId2 = await seedLote({ id_lote: crypto.randomUUID(), codigo_fungivora: 'LC-OTHER-010125-1' });
        state.loteIds.push(loteId2);

        const b1 = await seedBloque({ id_lote: loteId, id_inoculo: inoculoId, contaminado: 0 });
        const bOtro = await seedBloque({ id_lote: loteId2, id_inoculo: inoculoId, contaminado: 0 });

        await Bloque.actualizar_bloques_masivo(loteId, [{ id_bloque: b1, contaminado: 1 }]);

        const filasOtro = await Bloque.fetch_por_lote(loteId2);
        const bloqueOtro = filasOtro.find(b => b.id_bloque === bOtro);
        expect(Number(bloqueOtro.contaminado)).toBe(0); // sin cambios
    });

    test('hace rollback si ocurre un error durante la transacción', async () => {
        const { inoculoId, loteId } = await crearLoteConInoculo();
        const b1 = await seedBloque({ id_lote: loteId, id_inoculo: inoculoId, contaminado: 0 });

        // Provoke an error: pass an object as contaminado (type mismatch that breaks the query)
        await expect(
            Bloque.actualizar_bloques_masivo(loteId, [{ id_bloque: b1, contaminado: { invalid: true } }])
        ).rejects.toThrow();

        // Value must remain unchanged because of the rollback
        const filas = await Bloque.fetch_por_lote(loteId);
        const bloque = filas.find(b => b.id_bloque === b1);
        expect(Number(bloque.contaminado)).toBe(0);
    });

    test('es un no-op seguro cuando se pasa un arreglo vacío', async () => {
        const { inoculoId, loteId } = await crearLoteConInoculo();
        const b1 = await seedBloque({ id_lote: loteId, id_inoculo: inoculoId, contaminado: 0 });

        await expect(
            Bloque.actualizar_bloques_masivo(loteId, [])
        ).resolves.not.toThrow();

        const filas = await Bloque.fetch_por_lote(loteId);
        const bloque = filas.find(b => b.id_bloque === b1);
        expect(Number(bloque.contaminado)).toBe(0);
    });
});
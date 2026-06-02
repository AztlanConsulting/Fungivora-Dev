/**
 * @file lotes.model.integration.test.js
 * Real-database integration tests for backend/models/lotes.model.js
 */

'use strict';

jest.mock('../../util/db', () => require('./helpers/testDb').db);

const Lotes = require('../../models/lotes.model');
const { db, seedCategoria, seedInoculo, seedLote, cleanup, closePool } = require('./helpers/testDb');
const crypto = require('crypto');

let state = {};

beforeAll(async () => {
    await seedCategoria({ nombre_categoria: 'Especies', nombre_opcion: 'Shiitake', abreviatura_opcion: 'SH' });
});

beforeEach(() => {
    state = { loteIds: [], inoculoIds: [] };
});

afterEach(async () => {
    await cleanup(state);
    // Also clean by prefijo for transaction tests
    await cleanup({ prefijo: 'LC-TEST-' });
    await cleanup({ prefijo: 'LC-TX-' });
});

afterAll(async () => {
    await closePool();
});

// 
// crear_lote
// 

describe('Lotes.crear_lote', () => {
    test('inserta un lote y es recuperable luego', async () => {
        const id_lote = crypto.randomUUID();
        state.loteIds.push(id_lote);

        await Lotes.crear_lote(id_lote, 'LC-TEST-CREATE-1', '2024-06-01', 'Rack A', 1, 'Inoculación');

        const [filas] = await db.execute('SELECT * FROM Lotes WHERE id_lote = ?', [id_lote]);
        expect(filas.length).toBe(1);
        expect(filas[0].codigo_fungivora).toBe('LC-TEST-CREATE-1');
        expect(filas[0].fase).toBe('Inoculación');
    });
});

// 
// fetch_all
// 

describe('Lotes.fetch_all', () => {
    test('devuelve todos los lotes con las columnas esperadas', async () => {
        const id_lote = await seedLote({ codigo_fungivora: 'LC-FETCHALL-1' });
        state.loteIds.push(id_lote);

        const filas = await Lotes.fetch_all();

        expect(Array.isArray(filas)).toBe(true);
        expect(filas.length).toBeGreaterThanOrEqual(1);

        const lote = filas.find(l => l.id_lote === id_lote);
        expect(lote).toBeDefined();
        ['id_lote', 'codigo_fungivora', 'fecha_lote', 'ubicacion_lote', 'activo', 'fase'].forEach(col =>
            expect(lote).toHaveProperty(col)
        );
    });
});

// 
// fetch_by_id
// 

describe('Lotes.fetch_by_id', () => {
    test('devuelve el lote correcto con el JOIN a inoculo', async () => {
        const inoculoId = await seedInoculo({ especie: 'Shiitake', tipo: 'semilla', codigo_fungivora: 'FETCHBYID-INO' });
        const id_lote = await seedLote({ codigo_fungivora: 'LC-FETCHID-1' });
        state.inoculoIds.push(inoculoId);
        state.loteIds.push(id_lote);

        // Link bloque so JOIN produces especie
        await db.execute(
            'INSERT INTO Bloques (id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [crypto.randomUUID(), id_lote, inoculoId, 1, 500, 0, 'Bolsa', 'Paja']
        );

        const lote = await Lotes.fetch_by_id(id_lote);
        expect(lote).toBeDefined();
        expect(lote.id_lote).toBe(id_lote);
        expect(lote.especie).toBe('Shiitake');
    });

    test('devuelve undefined si el lote no existe', async () => {
        const lote = await Lotes.fetch_by_id('UUID-QUE-NO-EXISTE');
        expect(lote).toBeUndefined();
    });
});

// 
// actualizar_fase
// 

describe('Lotes.actualizar_fase', () => {
    test('cambia la fase y deja activo=1 en fases intermedias', async () => {
        const id_lote = await seedLote({ codigo_fungivora: 'LC-FASE-1', fase: 'Inoculación' });
        state.loteIds.push(id_lote);

        await Lotes.actualizar_fase(id_lote, 'Fructificación');

        const [filas] = await db.execute('SELECT fase, activo FROM Lotes WHERE id_lote = ?', [id_lote]);
        expect(filas[0].fase).toBe('Fructificación');
        expect(Number(filas[0].activo)).toBe(1);
    });

    test('pone activo=0 cuando la fase es Finalización', async () => {
        const id_lote = await seedLote({ codigo_fungivora: 'LC-FINAL-1', activo: 1, fase: 1 });
        state.loteIds.push(id_lote);

        await Lotes.actualizar_fase(id_lote, 'Finalización');

        const [filas] = await db.execute('SELECT fase, activo FROM Lotes WHERE id_lote = ?', [id_lote]);
        expect(filas[0].fase).toBe('Finalización');
        expect(Number(filas[0].activo)).toBe(0);
    });
});

// 
// actualizar_ubicacion
// 

describe('Lotes.actualizar_ubicacion', () => {
    test('actualiza la ubicación del lote', async () => {
        const id_lote = await seedLote({ codigo_fungivora: 'LC-UBIC-1', ubicacion_lote: 'Rack A' });
        state.loteIds.push(id_lote);

        await Lotes.actualizar_ubicacion(id_lote, 'Rack B');

        const [filas] = await db.execute('SELECT ubicacion_lote FROM Lotes WHERE id_lote = ?', [id_lote]);
        expect(filas[0].ubicacion_lote).toBe('Rack B');
    });
});

// 
// revision_lotes
// 

describe('Lotes.revision_lotes', () => {
    test('actualiza fecha_ultima_revision de los lotes indicados', async () => {
        const id1 = await seedLote({ codigo_fungivora: 'LC-REV-1' });
        const id2 = await seedLote({ codigo_fungivora: 'LC-REV-2' });
        state.loteIds.push(id1, id2);

        await Lotes.revision_lotes([id1, id2]);

        const [filas] = await db.execute(
            'SELECT id_lote, fecha_ultima_revision FROM Lotes WHERE id_lote IN (?, ?)',
            [id1, id2]
        );
        filas.forEach(f => expect(f.fecha_ultima_revision).not.toBeNull());
    });

    test('es un no-op seguro con arreglo vacío', async () => {
        await expect(Lotes.revision_lotes([])).resolves.toBeUndefined();
    });
});

// 
// eliminar_lote
// 

describe('Lotes.eliminar_lote', () => {
    test('elimina el lote y sus bloques en transacción', async () => {
        const inoculoId = await seedInoculo({ codigo_fungivora: 'DEL-INO-01', tipo: 'semilla' });
        const id_lote = await seedLote({ codigo_fungivora: 'LC-DEL-1' });
        state.inoculoIds.push(inoculoId);
        // Don't push id_lote — we expect it to be deleted

        await db.execute(
            'INSERT INTO Bloques (id_bloque, id_lote, id_inoculo, produccion, peso_gr, contaminado, contenedor, tipo_sustrato) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [crypto.randomUUID(), id_lote, inoculoId, 1, 100, 0, 'Bolsa', 'Paja']
        );

        await Lotes.eliminar_lote(id_lote);

        const [lotes] = await db.execute('SELECT * FROM Lotes  WHERE id_lote = ?', [id_lote]);
        const [bloques] = await db.execute('SELECT * FROM Bloques WHERE id_lote = ?', [id_lote]);
        expect(lotes).toEqual([]);
        expect(bloques).toEqual([]);
    });
});

// 
// count_lotes_similares
// 

describe('Lotes.count_lotes_similares', () => {
    test('cuenta lotes con el prefijo dado', async () => {
        const id1 = await seedLote({ codigo_fungivora: 'LC-TEST-CNT-010125-1' });
        const id2 = await seedLote({ codigo_fungivora: 'LC-TEST-CNT-010125-2' });
        state.loteIds.push(id1, id2);

        const total = await Lotes.count_lotes_similares('LC-TEST-CNT-010125');
        expect(total).toBeGreaterThanOrEqual(2);
    });

    test('devuelve 0 cuando no hay lotes con ese prefijo', async () => {
        const total = await Lotes.count_lotes_similares('LC-PREFIJO-QUE-NO-EXISTE');
        expect(total).toBe(0);
    });
});

// 
// registrar_lote_y_bloques (transacción completa)
// 

describe('Lotes.registrar_lote_y_bloques', () => {
    test('crea el lote y los bloques en una transacción y devuelve {id_lote, codigo_fungivora}', async () => {
        // Insert a semilla-type inoculo with a consumable code pattern
        const inoculoId = await seedInoculo({
            codigo_fungivora: 'SH-TX-SEMILLA',
            tipo: 'semilla',
            especie: 'Shiitake',
            cantidad_disponible: 5,
        });
        state.inoculoIds.push(inoculoId);

        const resultado = await Lotes.registrar_lote_y_bloques({
            ubicacion_lote: 'Rack TX',
            fecha_lote: '2025-01-01',
            produccion: 1,
            bloques: [
                { id_inoculo: inoculoId, cantidad: 2, peso_gr: 400, contenedor: 'Bolsa', tipo_sustrato: 'Paja' },
            ],
        });

        expect(resultado).toHaveProperty('id_lote');
        expect(resultado).toHaveProperty('codigo_fungivora');
        state.loteIds.push(resultado.id_lote);

        const [bloques] = await db.execute('SELECT * FROM Bloques WHERE id_lote = ?', [resultado.id_lote]);
        expect(bloques.length).toBe(2);
    });

    test('lanza error y hace rollback si el inóculo no existe', async () => {
        await expect(
            Lotes.registrar_lote_y_bloques({
                ubicacion_lote: 'Rack Err',
                fecha_lote: '2025-01-01',
                produccion: 1,
                bloques: [
                    { id_inoculo: 999999999, cantidad: 1, peso_gr: 100, contenedor: 'Bolsa', tipo_sustrato: 'Paja' },
                ],
            })
        ).rejects.toThrow('Inóculo no encontrado o sin existencias disponibles');
    });
});

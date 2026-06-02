/**
 * @file inventario.model.integration.test.js
 * Real-database integration tests for backend/models/inventario.model.js
 */

'use strict';

jest.mock('../../util/db', () => require('./helpers/testDb').db);

const Inventario = require('../../models/inventario.model');
const { db, seedInsumo, seedInoculo, cleanup, closePool } = require('./helpers/testDb');
const crypto = require('crypto');

let state = {};

beforeEach(() => {
    state = { insumoIds: [], inoculoIds: [] };
});

afterEach(async () => {
    await cleanup(state);
});

afterAll(async () => {
    await closePool();
});

// fetch_all

describe('Inventario.fetch_all', () => {
    test('retorna insumos e inóculos combinados con las columnas correctas', async () => {
        const insumoId = await seedInsumo({ nombre: 'Agua Test', cantidad: 200, unidad: 'Mililitro(s)', stock_recomendado: 50 });
        state.insumoIds.push(insumoId);

        const resultado = await Inventario.fetch_all();

        expect(Array.isArray(resultado)).toBe(true);
        expect(resultado.length).toBeGreaterThanOrEqual(1);

        const insumo = resultado.find(r => r.id === insumoId && r.tipo === 'insumo');
        expect(insumo).toBeDefined();
        expect(insumo).toMatchObject({
            nombre: 'Agua Test',
            cantidad: '200.00',
            unidad: 'Mililitro(s)',
            stock_recomendado: '50.00',
            tipo: 'insumo',
        });
    });

    test('no incluye inóculos con cantidad_disponible = 0', async () => {
        const inoculoId = await seedInoculo({
            codigo_fungivora: 'SINSTOCK-01',
            cantidad_disponible: 0,
            tipo: 'semilla',
        });
        state.inoculoIds.push(inoculoId);

        const resultado = await Inventario.fetch_all();
        const found = resultado.find(r => r.id === inoculoId);
        expect(found).toBeUndefined();
    });
});

// crear_insumo

describe('Inventario.crear_insumo', () => {
    test('inserta un nuevo insumo con datos válidos', async () => {
        const id_insumo = crypto.randomUUID();
        state.insumoIds.push(id_insumo);

        await Inventario.crear_insumo(id_insumo, 'Nuevo Insumo Test', 100, 20, 'Gramo(s)');

        const [filas] = await db.execute('SELECT * FROM Insumos WHERE id_insumo = ?', [id_insumo]);
        expect(filas.length).toBe(1);
        expect(filas[0].nombre).toBe('Nuevo Insumo Test');
        expect(Number(filas[0].cantidad)).toBe(100);
        expect(filas[0].unidad).toBe('Gramo(s)');
    });

    test('lanza error cuando el nombre contiene caracteres no permitidos (emoji)', async () => {
        await expect(
            Inventario.crear_insumo(crypto.randomUUID(), 'Nombre con emoji: 🍄', 10, 5, 'Gramo(s)')
        ).rejects.toThrow('El nombre contiene caracteres no permitidos');
    });

    test('lanza error cuando la unidad no es válida', async () => {
        await expect(
            Inventario.crear_insumo(crypto.randomUUID(), 'Insumo Valido', 10, 5, 'Litros')
        ).rejects.toThrow('Unidad inválida');
    });

    test('acepta las tres unidades permitidas', async () => {
        const unidades = ['Gramo(s)', 'Mililitro(s)', 'Pieza(s)'];

        for (const unidad of unidades) {
            const id = crypto.randomUUID();
            state.insumoIds.push(id);
            await Inventario.crear_insumo(id, `Test ${unidad}`, 1, 1, unidad);
        }

        expect(state.insumoIds.length).toBe(3);
    });
});

// update_cantidad

describe('Inventario.update_cantidad', () => {
    test('actualiza la cantidad y registra un log de tipo "In" cuando sube', async () => {
        const insumoId = await seedInsumo({ nombre: 'InsumoUpdate', cantidad: 50, unidad: 'Gramo(s)' });
        state.insumoIds.push(insumoId);

        await Inventario.update_cantidad(insumoId, 80);

        const [filas] = await db.execute('SELECT cantidad FROM Insumos WHERE id_insumo = ?', [insumoId]);
        expect(Number(filas[0].cantidad)).toBe(80);

        const [logs] = await db.execute(
            'SELECT * FROM Logs_ins_outs WHERE id_insumo = ? ORDER BY id_in_out DESC LIMIT 1',
            [insumoId]
        );
        expect(logs.length).toBe(1);
        expect(logs[0].tipo).toBe('In');
        expect(Number(logs[0].cantidad)).toBe(30);
    });

    test('registra un log de tipo "Out" cuando la cantidad baja', async () => {
        const insumoId = await seedInsumo({ nombre: 'InsumoOut', cantidad: 100, unidad: 'Gramo(s)' });
        state.insumoIds.push(insumoId);

        await Inventario.update_cantidad(insumoId, 60);

        const [logs] = await db.execute(
            'SELECT * FROM Logs_ins_outs WHERE id_insumo = ? ORDER BY id_in_out DESC LIMIT 1',
            [insumoId]
        );
        expect(logs[0].tipo).toBe('Out');
        expect(Number(logs[0].cantidad)).toBe(40);
    });

    test('devuelve true sin generar log cuando la cantidad no cambia', async () => {
        const insumoId = await seedInsumo({ nombre: 'InsumoSame', cantidad: 50, unidad: 'Gramo(s)' });
        state.insumoIds.push(insumoId);

        const [logsBefore] = await db.execute(
            'SELECT COUNT(*) AS total FROM Logs_ins_outs WHERE id_insumo = ?', [insumoId]
        );

        const resultado = await Inventario.update_cantidad(insumoId, 50);
        expect(resultado).toBe(true);

        const [logsAfter] = await db.execute(
            'SELECT COUNT(*) AS total FROM Logs_ins_outs WHERE id_insumo = ?', [insumoId]
        );
        expect(logsAfter[0].total).toBe(logsBefore[0].total);
    });

    test('lanza error si el insumo no existe', async () => {
        await expect(
            Inventario.update_cantidad(crypto.randomUUID(), 10)
        ).rejects.toThrow('Insumo no encontrado');
    });

    test('actualiza correctamente y deja DB consistente', async () => {
        const insumoId = await seedInsumo({ nombre: 'InsumoTx', cantidad: 30, unidad: 'Pieza(s)' });
        state.insumoIds.push(insumoId);

        await Inventario.update_cantidad(insumoId, 35);

        const [filas] = await db.execute('SELECT cantidad FROM Insumos WHERE id_insumo = ?', [insumoId]);
        const [logs] = await db.execute('SELECT * FROM Logs_ins_outs WHERE id_insumo = ?', [insumoId]);

        expect(Number(filas[0].cantidad)).toBe(35);
        expect(logs.length).toBeGreaterThanOrEqual(1);
    });
});
/**
 * @file inoculo.model.integration.test.js
 * Real-database integration tests for backend/models/inoculo.model.js
 */

'use strict';

jest.mock('../../util/db', () => require('./helpers/testDb').db);

const Inoculo = require('../../models/inoculo.model');
const { db, seedCategoria, seedInoculo, seedInsumo, cleanup, closePool } = require('./helpers/testDb');

let state = {};

beforeAll(async () => {
    // Ensure at least one Especie exists for fetchEspecies tests
    await seedCategoria({ nombre_categoria: 'Especies', nombre_opcion: 'Shiitake', abreviatura_opcion: 'SH' });
});

beforeEach(() => {
    state = { inoculoIds: [], insumoIds: [] };
});

afterEach(async () => {
    try {
        await cleanup(state);
    } catch (error) {
        console.error("Error en cleanup:", error);
    }
});

afterAll(async () => {
    await closePool();
});

// 
// fetchEspecies
// 

describe('Inoculo.fetchEspecies', () => {
    test('devuelve la columna "especie" con nombre_opcion de Categorias[Especies]', async () => {
        const [filas] = await Inoculo.fetchEspecies();
        expect(Array.isArray(filas)).toBe(true);
        expect(filas.length).toBeGreaterThanOrEqual(1);
        expect(filas[0]).toHaveProperty('especie');
    });
});

// 
// fetchInoculosFiltrados
// 

describe('Inoculo.fetchInoculosFiltrados', () => {
    test('filtra por especie y tipo correctamente', async () => {
        const id1 = await seedInoculo({ especie: 'Shiitake', tipo: 'Agar', codigo_fungivora: 'FILTRO-SH-A' });
        const id2 = await seedInoculo({ especie: 'Shiitake', tipo: 'semilla', codigo_fungivora: 'FILTRO-SH-S' });
        state.inoculoIds.push(id1, id2);

        const [filas] = await Inoculo.fetchInoculosFiltrados('Shiitake', 'Agar');
        const ids = filas.map(f => f.id_inoculo);

        expect(ids).toContain(id1);
        expect(ids).not.toContain(id2);
    });

    test('devuelve arreglo vacío si no hay coincidencias', async () => {
        const [filas] = await Inoculo.fetchInoculosFiltrados('EspecieInexistente', 'TipoInexistente');
        expect(filas).toEqual([]);
    });
});

// 
// obtenerEspecie
// 

describe('Inoculo.obtenerEspecie', () => {
    test('devuelve la especie del inóculo por id', async () => {
        const id = await seedInoculo({ especie: 'Pleurotus', tipo: 'semilla', codigo_fungivora: 'ESP-PL-01' });
        state.inoculoIds.push(id);

        const especie = await Inoculo.obtenerEspecie(id);
        expect(especie).toBe('Pleurotus');
    });

    test('devuelve undefined para un id inexistente', async () => {
        const especie = await Inoculo.obtenerEspecie(999999999);
        expect(especie).toBeUndefined();
    });
});

// 
// obtenerCodigoFungivora
// 

describe('Inoculo.obtenerCodigoFungivora', () => {
    test('devuelve el codigo_fungivora del inóculo por id', async () => {
        const id = await seedInoculo({ especie: 'Shiitake', tipo: 'semilla', codigo_fungivora: 'COD-SH-TEST' });
        state.inoculoIds.push(id);

        const codigo = await Inoculo.obtenerCodigoFungivora(id);
        expect(codigo).toBe('COD-SH-TEST');
    });

    test('devuelve undefined para un id inexistente', async () => {
        const codigo = await Inoculo.obtenerCodigoFungivora(999999999);
        expect(codigo).toBeUndefined();
    });
});

// 
// fetchInoculosParaSemilla
// 

describe('Inoculo.fetchInoculosParaSemilla', () => {
    test('solo devuelve tipos Agar o Medio Líquido con cantidad_disponible > 0', async () => {
        const idAgar = await seedInoculo({ tipo: 'Agar', cantidad_disponible: 3, codigo_fungivora: 'SEMILLA-AGAR' });
        const idMedLiq = await seedInoculo({ tipo: 'Medio Líquido', cantidad_disponible: 2, codigo_fungivora: 'SEMILLA-ML' });
        const idSemilla = await seedInoculo({ tipo: 'semilla', cantidad_disponible: 5, codigo_fungivora: 'SEMILLA-S' });
        const idVacio = await seedInoculo({ tipo: 'Agar', cantidad_disponible: 0, codigo_fungivora: 'SEMILLA-0' });
        state.inoculoIds.push(idAgar, idMedLiq, idSemilla, idVacio);

        const [filas] = await Inoculo.fetchInoculosParaSemilla();
        const ids = filas.map(f => f.id_inoculo);

        expect(ids).toContain(idAgar);
        expect(ids).toContain(idMedLiq);
        expect(ids).not.toContain(idSemilla);
        expect(ids).not.toContain(idVacio);
    });

    test('cada fila tiene las columnas correctas', async () => {
        const id = await seedInoculo({ tipo: 'Agar', cantidad_disponible: 1, codigo_fungivora: 'SEMILLA-COL' });
        state.inoculoIds.push(id);

        const [filas] = await Inoculo.fetchInoculosParaSemilla();
        const fila = filas.find(f => f.id_inoculo === id);

        expect(fila).toBeDefined();
        ['id_inoculo', 'codigo_fungivora', 'especie', 'tipo', 'cantidad_disponible', 'unidad', 'stock_recomendado']
            .forEach(col => expect(fila).toHaveProperty(col));
    });
});

// 
// insertInoculo + insertIngrediente + insertBitacora + updateInsumo + insertLog
// 

describe('Inoculo transaccionales (insert* / update*)', () => {
    test('insertInoculo inserta y devuelve el insertId', async () => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const insertId = await Inoculo.insertInoculo({
                id_inoculo_usado: null,
                cantidad_usada: null,
                codigo_fungivora: 'TX-INO-01',
                tipo: 'semilla',
                especie: 'Shiitake',
                fecha: '2024-06-01',
                cantidad_disponible: 5,
                unidad: 'Pieza(s)',
                stock_recomendado: 2,
            }, conn);
            await conn.commit();
            state.inoculoIds.push(insertId);

            expect(typeof insertId).toBe('number');
            expect(insertId).toBeGreaterThan(0);
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }
    });

    test('insertIngrediente vincula ingrediente a inóculo', async () => {
        const inoculoId = await seedInoculo({ codigo_fungivora: 'TX-INGR-01', tipo: 'Agar' });
        const insumoId = await seedInsumo({ nombre: 'Agar Agar Test', cantidad: 100, unidad: 'Gramo(s)' });
        state.inoculoIds.push(inoculoId);
        state.insumoIds.push(insumoId);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await Inoculo.insertIngrediente({ inoculoId, ingredienteId: insumoId, cantidad: 10 }, conn);
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }

        const [filas] = await db.execute(
            'SELECT * FROM Ingredientes WHERE id_inoculo_creado = ? AND id_insumo = ?',
            [inoculoId, insumoId]
        );
        expect(filas.length).toBe(1);
        expect(Number(filas[0].cantidad)).toBe(10);

        // Cleanup Ingrediente manually
        await db.execute('DELETE FROM Ingredientes WHERE id_inoculo_creado = ?', [inoculoId]);
    });

    test('insertBitacora registra nota en bitácora del inóculo', async () => {
        const inoculoId = await seedInoculo({ codigo_fungivora: 'TX-BIT-01', tipo: 'Agar' });
        state.inoculoIds.push(inoculoId);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await Inoculo.insertBitacora({ inoculoId, fecha: '2024-06-01', nota: 'Nota de prueba' }, conn);
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }

        const [filas] = await db.execute(
            'SELECT * FROM Bitacora_inoculos WHERE id_inoculo = ?',
            [inoculoId]
        );
        expect(filas.length).toBe(1);
        expect(filas[0].notas_bitacora).toBe('Nota de prueba');

        await db.execute('DELETE FROM Bitacora_inoculos WHERE id_inoculo = ?', [inoculoId]);
    });

    test('updateInsumo descuenta la cantidad del insumo', async () => {
        const insumoId = await seedInsumo({ nombre: 'InsumoUpdate2', cantidad: 200, unidad: 'Gramo(s)' });
        state.insumoIds.push(insumoId);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await Inoculo.updateInsumo({ cantidad: 30, ingredienteId: insumoId }, conn);
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }

        const [filas] = await db.execute('SELECT cantidad FROM Insumos WHERE id_insumo = ?', [insumoId]);
        expect(Number(filas[0].cantidad)).toBe(170);
    });

    test('updateInoculo descuenta la cantidad_disponible del inóculo', async () => {
        const inoculoId = await seedInoculo({ cantidad_disponible: 10, tipo: 'semilla', codigo_fungivora: 'TX-UPD-INO' });
        state.inoculoIds.push(inoculoId);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await Inoculo.updateInoculo({ cantidad_disponible: 4, id: inoculoId }, conn);
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }

        const [filas] = await db.execute(
            'SELECT cantidad_disponible FROM Inoculos WHERE id_inoculo = ?',
            [inoculoId]
        );
        expect(Number(filas[0].cantidad_disponible)).toBe(6);
    });

    test('insertLog registra una entrada en Logs_ins_outs', async () => {
        const insumoId = await seedInsumo({ nombre: 'LogTest', cantidad: 10, unidad: 'Pieza(s)' });
        state.insumoIds.push(insumoId);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await Inoculo.insertLog({ ingredienteId: insumoId, cantidad: 5, fecha: '2024-06-01', tipo: 'Out' }, conn);
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }

        const [logs] = await db.execute(
            'SELECT * FROM Logs_ins_outs WHERE id_insumo = ? ORDER BY id_in_out DESC LIMIT 1',
            [insumoId]
        );
        expect(logs.length).toBe(1);
        expect(logs[0].tipo).toBe('Out');
        expect(Number(logs[0].cantidad)).toBe(5);
    });
});

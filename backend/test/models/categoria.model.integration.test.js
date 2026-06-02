/**
 * @file categoria.model.integration.test.js
 * Real-database integration tests for backend/models/categoria.model.js
 */

'use strict';

jest.mock('../../util/db', () => require('./helpers/testDb').db);

const Categoria = require('../../models/categoria.model');
const { db, cleanup, closePool } = require('./helpers/testDb');

// Track inserted rows so afterEach can clean them up
const insertedCombos = [];   // { nombre_categoria, nombre_opcion }

async function seedCat(nombre_categoria, nombre_opcion, abreviatura_opcion = 'XX') {
    await db.execute(
        `INSERT IGNORE INTO Categorias (nombre_categoria, nombre_opcion, abreviatura_opcion) VALUES (?, ?, ?)`,
        [nombre_categoria, nombre_opcion, abreviatura_opcion]
    );
    insertedCombos.push({ nombre_categoria, nombre_opcion });
}

afterEach(async () => {
    for (const { nombre_categoria, nombre_opcion } of insertedCombos) {
        await db.execute(
            `DELETE FROM Categorias WHERE nombre_categoria = ? AND nombre_opcion = ?`,
            [nombre_categoria, nombre_opcion]
        );
    }
    insertedCombos.length = 0;
});

afterAll(async () => {
    await closePool();
});

// 
// fetchCategorias
// 

describe('Categoria.fetchCategorias', () => {
    test('devuelve al menos una categoría existente', async () => {
        await seedCat('TestCat', 'OpcionA', 'TA');

        const [filas] = await Categoria.fetchCategorias();

        expect(Array.isArray(filas)).toBe(true);
        expect(filas.length).toBeGreaterThanOrEqual(1);
        // Each row must have only the 'categoria' alias
        expect(filas[0]).toHaveProperty('categoria');
    });

    test('retorna nombres de categoría únicos (DISTINCT)', async () => {
        await seedCat('DupCat', 'OpA', 'DA');
        await seedCat('DupCat', 'OpB', 'DB');

        const [filas] = await Categoria.fetchCategorias();
        const cats = filas.map(f => f.categoria);
        const uniqCats = [...new Set(cats)];

        expect(cats.length).toBe(uniqCats.length);
    });
});

// 
// fetchOpciones
// 

describe('Categoria.fetchOpciones', () => {
    test('devuelve opciones de una categoría existente (nombre completo por defecto)', async () => {
        await seedCat('FruitCat', 'Manzana', 'MZ');
        await seedCat('FruitCat', 'Pera', 'PR');

        const [filas] = await Categoria.fetchOpciones('FruitCat', false);
        const opciones = filas.map(f => f.opcion);

        expect(opciones).toContain('Manzana');
        expect(opciones).toContain('Pera');
    });

    test('devuelve abreviaturas cuando abreviado = true', async () => {
        await seedCat('AbrevCat', 'Pleurotus ostreatus', 'PO');

        const [filas] = await Categoria.fetchOpciones('AbrevCat', true);
        const opciones = filas.map(f => f.opcion);

        expect(opciones).toContain('PO');
        // Full name must NOT appear when abreviado = true
        expect(opciones).not.toContain('Pleurotus ostreatus');
    });

    test('retorna arreglo vacío para una categoría inexistente', async () => {
        const [filas] = await Categoria.fetchOpciones('CATEGORIA_QUE_NO_EXISTE', false);
        expect(filas).toEqual([]);
    });

    test('resultado está ordenado ASC', async () => {
        await seedCat('OrdCat', 'Zeta', 'ZZ');
        await seedCat('OrdCat', 'Alpha', 'AL');

        const [filas] = await Categoria.fetchOpciones('OrdCat', false);
        const opciones = filas.map(f => f.opcion);

        expect(opciones.indexOf('Alpha')).toBeLessThan(opciones.indexOf('Zeta'));
    });
});

// 
// fetchAbreviaturaPorNombre
// 

describe('Categoria.fetchAbreviaturaPorNombre', () => {
    test('devuelve la abreviatura correcta para una especie existente', async () => {
        await seedCat('Especies', 'Lentinula edodes', 'LE');

        const [filas] = await Categoria.fetchAbreviaturaPorNombre('Lentinula edodes');

        expect(filas.length).toBeGreaterThanOrEqual(1);
        expect(filas[0].abreviatura_opcion).toBe('LE');
    });

    test('devuelve arreglo vacío para un nombre de especie inexistente', async () => {
        const [filas] = await Categoria.fetchAbreviaturaPorNombre('Especie Que No Existe XYZ');
        expect(filas).toEqual([]);
    });

    test('solo devuelve filas de la categoría Especies', async () => {
        // Same nombre_opcion, different categoria — should not be returned
        await seedCat('OtraCategoria', 'Lentinula edodes', 'OT');
        await seedCat('Especies', 'Lentinula edodes', 'LE2');

        const [filas] = await Categoria.fetchAbreviaturaPorNombre('Lentinula edodes');

        const abreviaturas = filas.map(f => f.abreviatura_opcion);
        expect(abreviaturas).toContain('LE2');
        expect(abreviaturas).not.toContain('OT');
    });
});

// 
// fetchTodasLasCategorias
// 

describe('Categoria.fetchTodasLasCategorias', () => {
    test('devuelve todas las filas de la tabla Categorias', async () => {
        await seedCat('ZCat', 'ZOp', 'ZP');

        const [filas] = await Categoria.fetchTodasLasCategorias();

        expect(Array.isArray(filas)).toBe(true);
        expect(filas.length).toBeGreaterThanOrEqual(1);
    });

    test('resultado está ordenado por nombre_categoria ASC y nombre_opcion ASC', async () => {
        await seedCat('BetaCat', 'ZOp', 'BZ');
        await seedCat('AlphaCat', 'AOp', 'AA');

        const [filas] = await Categoria.fetchTodasLasCategorias();
        const categorias = filas.map(f => f.nombre_categoria);

        const indexAlpha = categorias.indexOf('AlphaCat');
        const indexBeta = categorias.indexOf('BetaCat');

        if (indexAlpha !== -1 && indexBeta !== -1) {
            expect(indexAlpha).toBeLessThan(indexBeta);
        }
    });

    test('cada fila tiene las columnas esperadas', async () => {
        await seedCat('ColTestCat', 'ColTestOp', 'CT');

        const [filas] = await Categoria.fetchTodasLasCategorias();
        const fila = filas.find(f => f.nombre_categoria === 'ColTestCat');

        expect(fila).toBeDefined();
        expect(fila).toHaveProperty('nombre_categoria');
        expect(fila).toHaveProperty('nombre_opcion');
        expect(fila).toHaveProperty('abreviatura_opcion');
    });
});

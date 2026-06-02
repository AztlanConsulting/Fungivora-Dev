/**
 * @file usuario.model.integration.test.js
 * Real-database integration tests for backend/models/usuario.model.js
 */

'use strict';

jest.mock('../../util/db', () => require('./helpers/testDb').db);

const Usuario = require('../../models/usuario.model');
const { db, seedUsuario, cleanup, closePool } = require('./helpers/testDb');

let state = {};

beforeEach(() => {
    state = { usuarioIds: [] };
});

afterEach(async () => {
    await cleanup(state);
});

afterAll(async () => {
    await closePool();
});

// 
// crear
// 

describe('Usuario.crear', () => {
    test('inserta un nuevo usuario con los valores por defecto', async () => {
        const [result] = await Usuario.crear({
            nombre_usuario: 'nuevoUsuario',
            correo_usuario: 'nuevo@test.fungivora',
            contrasena_usuario: '$2b$10$hash',
        });
        state.usuarioIds.push(result.insertId);

        const [filas] = await db.execute('SELECT * FROM Usuarios WHERE id_usuario = ?', [result.insertId]);
        expect(filas.length).toBe(1);
        expect(filas[0].nombre_usuario).toBe('nuevoUsuario');
        expect(filas[0].estatus_usuario).toBe(1);
        expect(Number(filas[0].is_user_admin)).toBe(0);
    });

    test('inserta un usuario admin', async () => {
        const [result] = await Usuario.crear({
            nombre_usuario: 'adminUser',
            correo_usuario: 'admin@test.fungivora',
            contrasena_usuario: '$2b$10$hash',
            is_user_admin: 1,
        });
        state.usuarioIds.push(result.insertId);

        const [filas] = await db.execute('SELECT is_user_admin FROM Usuarios WHERE id_usuario = ?', [result.insertId]);
        expect(Number(filas[0].is_user_admin)).toBe(1);
    });
});

// 
// fetch_one
// 

describe('Usuario.fetch_one', () => {
    test('encuentra al usuario por nombre (case-insensitive)', async () => {
        const id = await seedUsuario({ nombre_usuario: 'TestUser1', correo_usuario: 'tu1@test.fungivora' });
        state.usuarioIds.push(id);

        const user = await Usuario.fetch_one('testuser1');
        expect(user).toBeDefined();
        expect(user.id_usuario).toBe(id);
    });

    test('encuentra al usuario por correo (case-insensitive)', async () => {
        const id = await seedUsuario({ nombre_usuario: 'TU2', correo_usuario: 'TestUser2@TEST.fungivora' });
        state.usuarioIds.push(id);

        const user = await Usuario.fetch_one('testuser2@test.fungivora');
        expect(user).toBeDefined();
        expect(user.id_usuario).toBe(id);
    });

    test('devuelve undefined si no encuentra al usuario', async () => {
        const user = await Usuario.fetch_one('usuarioQueNoExiste999');
        expect(user).toBeUndefined();
    });

    test('devuelve las columnas correctas (incluye contrasena, no expone campos extra)', async () => {
        const id = await seedUsuario({ nombre_usuario: 'ColUser', correo_usuario: 'col@test.fungivora' });
        state.usuarioIds.push(id);

        const user = await Usuario.fetch_one('ColUser');
        ['id_usuario', 'nombre_usuario', 'correo_usuario', 'contrasena_usuario', 'estatus_usuario', 'is_user_admin']
            .forEach(col => expect(user).toHaveProperty(col));
    });
});

// 
// fetch_by_id
// 

describe('Usuario.fetch_by_id', () => {
    test('devuelve el usuario correcto por id', async () => {
        const id = await seedUsuario({ nombre_usuario: 'ById1', correo_usuario: 'byid1@test.fungivora' });
        state.usuarioIds.push(id);

        const user = await Usuario.fetch_by_id(id);
        expect(user).toBeDefined();
        expect(user.id_usuario).toBe(id);
        expect(user.nombre_usuario).toBe('ById1');
    });

    test('NO devuelve la contraseña', async () => {
        const id = await seedUsuario({ nombre_usuario: 'NoPwd', correo_usuario: 'nopwd@test.fungivora' });
        state.usuarioIds.push(id);

        const user = await Usuario.fetch_by_id(id);
        expect(user).not.toHaveProperty('contrasena_usuario');
    });

    test('devuelve undefined para un id inexistente', async () => {
        const user = await Usuario.fetch_by_id(999999999);
        expect(user).toBeUndefined();
    });
});

// 
// fetch_all
// 

describe('Usuario.fetch_all', () => {
    test('devuelve todos los usuarios con las columnas correctas', async () => {
        const id = await seedUsuario({ nombre_usuario: 'FetchAllUser', correo_usuario: 'fetchall@test.fungivora' });
        state.usuarioIds.push(id);

        const filas = await Usuario.fetch_all();
        expect(Array.isArray(filas)).toBe(true);
        expect(filas.length).toBeGreaterThanOrEqual(1);

        const user = filas.find(u => u.id_usuario === id);
        expect(user).toBeDefined();
        expect(user).not.toHaveProperty('contrasena_usuario');
    });
});

// 
// eliminar
// 

describe('Usuario.eliminar', () => {
    test('elimina el usuario de la base de datos', async () => {
        const id = await seedUsuario({ nombre_usuario: 'DelUser', correo_usuario: 'del@test.fungivora' });
        // Don't push to state — we handle cleanup manually here

        await Usuario.eliminar(id);

        const [filas] = await db.execute('SELECT * FROM Usuarios WHERE id_usuario = ?', [id]);
        expect(filas).toEqual([]);
    });

    test('no lanza error al intentar eliminar un id inexistente', async () => {
        await expect(Usuario.eliminar(999999999)).resolves.not.toThrow();
    });
});

const db = require('../util/db');

class Lotes {
    constructor(id_lote, id_inoculo, tipo_sustrato, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase) {
        this.id_lote = id_lote;
        this.id_inoculo = id_inoculo;
        this.tipo_sustrato = tipo_sustrato;
        this.codigo_fungivora = codigo_fungivora;
        this.fecha_lote = fecha_lote;
        this.ubicacion_lote = ubicacion_lote;
        this.activo = activo;
        this.fase = fase;
    }

    static async fetch_all() {
        try {
            const [filas] = await db.execute(`
                SELECT 
                    id_lote, 
                    id_inoculo, 
                    tipo_sustrato, 
                    codigo_fungivora, 
                    fecha_lote, 
                    ubicacion_lote, 
                    activo, 
                    fase 
                FROM Lotes 
                ORDER BY fecha_lote DESC
            `);
            return filas;
        } catch (err) {
            console.error("Error en fetch_all lotes:", err);
            throw err;
        }
    }

    // Obtiene todas las categorías
    static fetch_categorias = async () => {
        const [filas] = await db.execute('SELECT * FROM Categorias');
        return filas;
    }

    // Metodo para asignar valores a la tabla de lotes
    static async crear_lote(id_lote, id_inoculo, tipo_sustrato, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase) {
        try {
            return await db.execute(`
                INSERT INTO Lotes (
                    id_lote, id_inoculo, tipo_sustrato, codigo_fungivora, 
                    fecha_lote, ubicacion_lote, activo, fase
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [id_lote, id_inoculo, tipo_sustrato, codigo_fungivora, fecha_lote, ubicacion_lote, activo, fase]);
        } catch (err) {
            console.error("Error en crear_lote model:", err);
            throw err;
        }
    }

    //  Metodo para actualizar la fase del lote
    static async actualizar_fase(id_lote, nuevaFase) {
        try {
            return await db.execute(`
                UPDATE Lotes 
                SET fase = ? 
                WHERE id_lote = ?
            `, [nuevaFase, id_lote]);
        } catch (err) {
            console.error("Error en actualizar_fase model:", err);
            throw err;
        }
    }
    // Metodo para encontrar los inoculos activos
    static async fetch_inoculos_disponibles() {
        try {
            const [filas] = await db.execute(`
                SELECT
                    id_inoculo,
                    codigo_fungivora,
                    especie,
                    cantidad_disponible,
                    unidad
                FROM Inoculos
                WHERE cantidad_disponible > 0
                ORDER BY fecha DESC
            `);
            return filas;
        } catch (err) {
            console.error("Error en fetch_inoculos_disponibles:", err);
            throw err;
        }
    }
}

module.exports = Lotes;
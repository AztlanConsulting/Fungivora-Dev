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
}

module.exports = Lotes;
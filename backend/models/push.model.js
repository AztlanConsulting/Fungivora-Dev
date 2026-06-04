const db = require('../util/db');

/**
 * Model o PushSubscription
 *   id            INT AUTO_INCREMENT PRIMARY KEY
 *   id_usuario    VARCHAR(36) NOT NULL
 *   endpoint      TEXT NOT NULL UNIQUE
 *   p256dh        TEXT NOT NULL
 *   auth          TEXT NOT NULL
 *   created_at    DATETIME DEFAULT NOW()
 */
class PushSubscription {
    /** Activa una subscripción de usuario. */
    static async save(id_usuario, subscription) {
        const { endpoint, keys: { p256dh, auth } } = subscription;
        return db.execute(
            `INSERT INTO SuscripcionesPush (id_usuario, endpoint, p256dh, auth)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               p256dh     = VALUES(p256dh),
               auth       = VALUES(auth),
               id_usuario = VALUES(id_usuario)`,
            [id_usuario, endpoint, p256dh, auth]
        );
    }

    /** Remueve una subscripción. */
    static async delete(endpoint) {
        return db.execute(
            'DELETE FROM SuscripcionesPush WHERE endpoint = ?',
            [endpoint]
        );
    }

    /** Devuelve todas las subscripciones activas. */
    static async fetchAll() {
        const [rows] = await db.execute(
            'SELECT id, id_usuario, endpoint, p256dh, auth FROM SuscripcionesPush'
        );
        return rows;
    }

    /** Subscripciones de un usuario. */
    static async fetchByUser(id_usuario) {
        const [rows] = await db.execute(
            'SELECT id, endpoint, p256dh, auth FROM SuscripcionesPush WHERE id_usuario = ?',
            [id_usuario]
        );
        return rows;
    }
}

module.exports = PushSubscription;

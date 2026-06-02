/**
 * Utilidad reutilizable para difusión de notificaciones.
 * Importar donde se necesite enviar una notificación push
 *
 * Uso:
 *   const sendPushToAll = require('../util/sendPushToAll');
 *   await sendPushToAll({ title: 'Alerta', body: 'Hay lotes por revisar', url: '/home' });
 */

const { _broadcast } = require('../controllers/push.controller');

/**
 * @param {{ title?: string, body: string, url?: string }} options
 * @returns {Promise<{ sent: number, failed: number }>}
 */
async function sendPushToAll({ title = 'Devora', body, url = '/home' } = {}) {
    if (!body) {
        console.warn('sendPushToAll: se llamó sin "body", omitiendo envío.');
        return { sent: 0, failed: 0 };
    }

    const payload = JSON.stringify({ title, body, url });
    return _broadcast(payload);
}

module.exports = sendPushToAll;

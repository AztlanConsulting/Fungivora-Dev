const webpush = require('web-push');
const PushSubscription = require('../models/push.model');

// Configurar web-push una sola vez al cargar el módulo
webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

/**
 * POST /api/push/subscribe
 * Body: { subscription: PushSubscriptionJSON }
 * Guarda (o actualiza) una suscripción push asociada al usuario autenticado.
 */
exports.subscribe = async (req, res) => {
    try {
        const { subscription } = req.body;

        if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
            return res.status(400).json({ success: false, message: 'Suscripción inválida' });
        }

        await PushSubscription.save(req.user.id_usuario, subscription);
        return res.status(201).json({ success: true, message: 'Suscripción guardada' });
    } catch (error) {
        console.error('Error en push.subscribe:', error);
        return res.status(500).json({ success: false, message: 'Error al guardar la suscripción' });
    }
};

/**
 * DELETE /api/push/unsubscribe
 * Body: { endpoint: string }
 * Elimina una suscripción push para que el dispositivo deje de recibir notificaciones.
 */
exports.unsubscribe = async (req, res) => {
    try {
        const { endpoint } = req.body;

        if (!endpoint) {
            return res.status(400).json({ success: false, message: 'Falta el endpoint' });
        }

        await PushSubscription.delete(endpoint);
        return res.status(200).json({ success: true, message: 'Suscripción eliminada' });
    } catch (error) {
        console.error('Error en push.unsubscribe:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar la suscripción' });
    }
};

/**
 * POST /api/push/send
 * Body: { title: string, body: string, url?: string }
 * Difusión manual solo para administradores (protegida mediante RBAC a nivel de ruta).
 */
exports.sendNotification = async (req, res) => {
    try {
        const { title = 'Devora', body = '', url = '/home' } = req.body;

        if (!body) {
            return res.status(400).json({ success: false, message: 'El campo "body" es obligatorio' });
        }

        const payload = JSON.stringify({ title, body, url });
        const results = await _broadcast(payload);

        return res.status(200).json({
            success: true,
            sent: results.sent,
            failed: results.failed
        });
    } catch (error) {
        console.error('Error en push.sendNotification:', error);
        return res.status(500).json({ success: false, message: 'Error al enviar la notificación' });
    }
};

/**
 * Envía el `payload` a todas las suscripciones almacenadas.
 * Las suscripciones que devuelven 404/410 (expiradas) se eliminan automáticamente.
 *
 * @param {string} payload - JSON string
 * @returns {{ sent: number, failed: number }}
 */
async function _broadcast(payload) {
    const subscriptions = await PushSubscription.fetchAll();
    let sent = 0;
    let failed = 0;

    await Promise.allSettled(
        subscriptions.map(async (sub) => {
            const pushSub = {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth }
            };

            try {
                await webpush.sendNotification(pushSub, payload);
                sent++;
            } catch (err) {
                failed++;
                // 404 / 410 → la suscripción ya no es válida, se elimina
                if (err.statusCode === 404 || err.statusCode === 410) {
                    console.warn(`Push: limpiando suscripción expirada: ${sub.endpoint.slice(0, 60)}…`);
                    await PushSubscription.delete(sub.endpoint).catch(() => { });
                } else {
                    console.error(`Push: fallo al enviar a ${sub.endpoint.slice(0, 60)}:`, err.message);
                }
            }
        })
    );

    return { sent, failed };
}

exports._broadcast = _broadcast;

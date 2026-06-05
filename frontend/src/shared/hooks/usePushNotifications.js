import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * Convierte el formato VAPID public key
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export function usePushNotifications() {
    const isSupported =
        typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;

    const [permission, setPermission] = useState(
        isSupported ? Notification.permission : 'denied'
    );
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Al iniciar: Verificar si el navegador tiene subscripción 
    useEffect(() => {
        if (!isSupported) return;

        let cancelled = false;

        const checkExisting = async () => {
            try {
                const registration = await navigator.serviceWorker.ready;
                const existing = await registration.pushManager.getSubscription();
                if (!cancelled) setIsSubscribed(!!existing);
            } catch (err) {
                console.warn('usePushNotifications: no se pudo verificar la suscripción existente', err);
            }
        };

        checkExisting();
        return () => { cancelled = true; };
    }, [isSupported]);

    // Subscribirse
    const subscribe = useCallback(async () => {
        if (!isSupported) {
            setError('Tu navegador no soporta notificaciones push.');
            return;
        }
        if (!VAPID_PUBLIC_KEY) {
            setError('VITE_VAPID_PUBLIC_KEY no está configurada.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Permisos
            const perm = await Notification.requestPermission();
            setPermission(perm);

            if (perm !== 'granted') {
                setError('Permiso de notificaciones denegado.');
                setLoading(false);
                return;
            }

            // Esperar al SW
            const registration = await navigator.serviceWorker.ready;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            await api.post('/push/subscribe', {
                subscription: subscription.toJSON()
            });

            setIsSubscribed(true);
        } catch (err) {
            console.error('usePushNotifications subscribe error:', err);
            setError('No se pudo activar las notificaciones. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    }, [isSupported]);

    // Desuscribirse
    const unsubscribe = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await api.delete('/push/unsubscribe', { endpoint: subscription.endpoint });
                await subscription.unsubscribe();
            }

            setIsSubscribed(false);
        } catch (err) {
            console.error('usePushNotifications unsubscribe error:', err);
            setError('No se pudo desactivar las notificaciones.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isSupported,
        permission,
        isSubscribed,
        loading,
        error,
        subscribe,
        unsubscribe
    };
}

export default usePushNotifications;

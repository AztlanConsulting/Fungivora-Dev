import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification01Icon, NotificationOff01Icon } from '@hugeicons/core-free-icons';
import { colores } from '../basics/Colores';
import Text from '../basics/Texto';
import usePushNotifications from '../../../../shared/hooks/usePushNotifications';

const NotificacionesToggle = () => {
    const {
        isSupported,
        permission,
        isSubscribed,
        loading,
        error,
        subscribe,
        unsubscribe
    } = usePushNotifications();

    if (!isSupported) return null;

    const handleToggle = () => {
        if (isSubscribed) {
            unsubscribe();
        } else {
            subscribe();
        }
    };

    const denied = permission === 'denied';

    return (
        <div className="flex flex-col gap-1">
            <div
                className="flex items-center justify-between px-5 py-3 rounded-2xl gap-6"
                style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.06)',
                }}
            >
                <Text
                    variante="label"
                    style={{
                        color: isSubscribed ? colores.azul : colores.gris,
                        fontWeight: 500,
                    }}
                >
                    Notificaciones
                </Text>

                {/* Toggle */}
                <button
                    onClick={handleToggle}
                    disabled={loading || denied}
                    role="switch"
                    aria-checked={isSubscribed}
                    aria-label={isSubscribed ? 'Desactivar notificaciones' : 'Activar notificaciones'}
                    title={
                        denied
                            ? 'Notificaciones bloqueadas — actívalas en la configuración de tu navegador'
                            : isSubscribed
                                ? 'Desactivar notificaciones push'
                                : 'Activar notificaciones push'
                    }
                    className="relative flex-shrink-0"
                    style={{
                        width: 58,
                        height: 34,
                        borderRadius: 999,
                        border: 'none',
                        padding: 0,
                        cursor: loading || denied ? 'not-allowed' : 'pointer',
                        opacity: loading || denied ? 0.4 : 1,
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.13), 0 0 0 0.5px rgba(0,0,0,0.08)',
                        outline: 'none',
                    }}
                >
                    <span
                        style={{
                            position: 'absolute',
                            top: 3,
                            left: isSubscribed ? 'calc(100% - 31px)' : 3,
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: isSubscribed ? colores.azul : '#C7C7CC',
                            boxShadow: isSubscribed
                                ? '0 2px 4px rgba(0,0,0,0.25)'
                                : '0 2px 4px rgba(0,0,0,0.18)',
                            transition: 'left 0.25s ease, background-color 0.25s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {loading ? (
                            <span
                                style={{
                                    width: 14,
                                    height: 14,
                                    border: `2px solid #FFFFFF`,
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'spin 0.7s linear infinite',
                                }}
                            />
                        ) : (
                            <HugeiconsIcon
                                icon={isSubscribed ? Notification01Icon : NotificationOff01Icon}
                                size={14}
                                color="#FFFFFF"
                                strokeWidth={1.5}
                            />
                        )}
                    </span>
                </button>
            </div>

            {error && (
                <Text
                    variante="body"
                    style={{
                        color: '#E53E3E',
                        fontSize: '10px',
                        textAlign: 'center',
                        lineHeight: 1.2,
                    }}
                >
                    {error}
                </Text>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default NotificacionesToggle;
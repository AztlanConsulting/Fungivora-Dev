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
                style={{ backgroundColor: '#EEF0FB' }}
            >
                <div className="flex items-center gap-3">
                    <HugeiconsIcon
                        icon={isSubscribed ? Notification01Icon : NotificationOff01Icon}
                        size={20}
                        color={isSubscribed ? colores.azul : colores.gris}
                        strokeWidth={1.5}
                    />
                    <Text variante="label" style={{ color: `${isSubscribed ? colores.azul : colores.gris}`, fontWeight: 500 }}>
                        Notificaciones
                    </Text>
                </div>

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
                    className="relative flex-shrink-0 transition-opacity"
                    style={{
                        width: 51,
                        height: 31,
                        borderRadius: 999,
                        border: 'none',
                        padding: 0,
                        cursor: loading || denied ? 'not-allowed' : 'pointer',
                        opacity: loading || denied ? 0.4 : 1,
                        backgroundColor: isSubscribed ? colores.azul : '#C7C7CC',
                        transition: 'background-color 0.25s ease',
                        outline: 'none',
                    }}
                >
                    <span
                        style={{
                            position: 'absolute',
                            top: 2,
                            left: isSubscribed ? 'calc(100% - 29px)' : 2,
                            width: 27,
                            height: 27,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                            transition: 'left 0.25s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {loading && (
                            <span
                                style={{
                                    width: 14,
                                    height: 14,
                                    border: `2px solid ${colores.azul}`,
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'spin 0.7s linear infinite',
                                }}
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
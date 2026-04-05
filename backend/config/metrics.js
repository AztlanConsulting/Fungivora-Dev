const client = require('prom-client');

// 1. Crear el registro central
const register = new client.Registry();

// 2. Activar métricas por defecto (CPU, Memoria, Event Loop)
client.collectDefaultMetrics({ register });

// 3. Definir un Contador para las peticiones totales
const httpRequestCounter = new client.Counter({
    name: 'fungivora_http_requests_total',
    help: 'Total de peticiones procesadas por Fungivora',
    labelNames: ['method', 'route', 'status']
});

// 4. Definir un Histograma para la duración de las respuestas
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 2, 3, 5] // Rangos de tiempo en segundos
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestCounter);

module.exports = { register, httpRequestCounter, httpRequestDurationMicroseconds };


const { httpRequestCounter, httpRequestDurationMicroseconds } = require('../config/metrics');

const monitor = (req, res, next) => {
    // Iniciar el cronómetro
    const end = httpRequestDurationMicroseconds.startTimer();

    res.on('finish', () => {
        // Evitar monitorear la propia ruta de métricas para no sesgar los datos
        if (req.path !== '/metrics') {
            const labels = { 
                method: req.method, 
                route: req.path, 
                status: res.statusCode 
            };

            // Incrementar el contador con las etiquetas correspondientes
            httpRequestCounter.inc(labels);

            // Detener el cronómetro y registrar la duración
            end({ code: res.statusCode });
        }
    });
    next();
};

module.exports = monitor;
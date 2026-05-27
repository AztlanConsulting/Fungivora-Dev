const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const generalRoutes = require('./routes/general.routes');

// Variables de entorno
dotenv.config({ quiet: true, path: require('path').join(__dirname, '../.env') });

const { register } = require('./config/metrics');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// * Metricas de Grafana (Se quedan aquí arriba, ya que Prometheus/Grafana no usan tokens de usuario)
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Enrutador Principal
app.use('/api', generalRoutes);

module.exports = app;
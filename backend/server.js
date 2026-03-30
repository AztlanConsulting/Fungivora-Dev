const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(cors());

app.get('/api', (req, res) => {
    res.json({ mensaje: "Respuesta del backend" });
});

const rutas_login = require('./routes/inicio_sesion.routes');
app.use('/', rutas_login);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

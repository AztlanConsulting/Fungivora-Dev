const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api', (req, res) => {
    res.json({ mensaje: "Respuesta del backend" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

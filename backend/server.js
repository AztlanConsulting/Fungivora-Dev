const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const generalRoutes = require('./routes/general.routes');

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const PORT = process.env.BACKEND_PORT;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ mensaje: "Respuesta del backend" });
});

app.use('/', generalRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

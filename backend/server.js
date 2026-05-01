const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const app = require('./app');

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

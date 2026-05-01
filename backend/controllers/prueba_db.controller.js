const db = require('../util/db');

exports.get_data = async (req, res) => {
    const inicio = Date.now();
    try {
        const [rows] = await db.execute('SELECT * FROM Categorias LIMIT 100');

        const duracion = Date.now() - inicio;
        res.status(200).json({
            status: 'success',
            tiempo_respuesta: `${duracion}ms`,
            datos_recuperados: rows.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};
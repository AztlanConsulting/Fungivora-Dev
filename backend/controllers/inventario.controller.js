const Inventario = require('../models/inventario.model');

/*
* get_inventory
Obtener la información del inventario
Metodo que hace una llamada al modelo apra obtener la info necesaria
@param filas
*/
exports.get_inventory = async (req, res) => {
  try {
    const filas = await Inventario.fetch_all();

    res.json(filas); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener inventario" });
  }
};

exports.get_categorias = async (req, res) => {
    try {
        const [rows] = await Inventario.fetch_categorias();
        res.status(200).json({
            status: 'success',
            categorias: rows,

        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};
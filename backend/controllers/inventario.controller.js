const Inventario = require('../models/inventario.model');

exports.get_inventory = async (req, res) => {
  try {
    const filas = await Inventario.fetch_all();

    res.json(filas); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener inventario" });
  }
};
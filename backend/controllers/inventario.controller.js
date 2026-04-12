const Inventario = require('../models/inventario.model');
const crypto = require('crypto');

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

exports.post_crear_insumo = async (req, res) => {
    try {
        const rows = await Inventario.fetch_all();
        const{nombre_insumo, cantidad_inicial, stock_minimo, unidad_medida, id_categoria} = req.body;

        const existe = rows.some(item => 
          item.nombre_inventario.toLowerCase() === nombre_insumo.toLowerCase());

        if (existe) {
            return res.status(400).json({ status: 'error', error: 'El insumo ya existe' });
        }
        
        const fecha_actual = new Date().toISOString();

        const id_inventario = crypto
            .createHash('sha256')
            .update(`${nombre_insumo}-${fecha_actual}`)
            .digest('hex')
            .substring(0, 36); // Lo cortamos a 36 caracteres para tu CHAR(36)

        try {
          const crear = await Inventario.crear_insumo(id_inventario, nombre_insumo, cantidad_inicial, stock_minimo, unidad_medida, id_categoria);
          res.status(200).json({
              status: 'success',
          });
      } catch (error) {
          console.error('Error al crear insumo:', error);
          res.status(500).json({ status: 'error', error: 'Error al crear insumo' });
      }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};
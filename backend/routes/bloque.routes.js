const express = require('express');
const router = express.Router();

const controller = require('../controllers/bloque.controller');

// Ruta para obtener los bloques por lote
router.get('/', controller.get_bloques_por_lote);
// Actualización masiva de bloques de un lote
router.put('/masivo', controller.actualizar_bloques_masivo);

module.exports = router;
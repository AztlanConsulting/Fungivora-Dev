const express = require('express');
const router = express.Router();

const controller = require('../controllers/bloque.controller');

// Ruta para obtener los bloques por lote
router.get('/', controller.get_bloques_por_lote);

router.post('/crear', controller.post_bloques); 
router.get('/contenedores', controller.get_contenedores);
// Ruta para actualizar el estado de contaminado de un bloque
router.put('/contaminado', controller.toggle_contaminado);

module.exports = router;
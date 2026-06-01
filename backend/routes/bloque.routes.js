const express = require('express');
const router = express.Router();

const controller = require('../controllers/bloque.controller');

// Ruta para obtener los bloques por lote
router.get('/', controller.get_bloques_por_lote);

// Ruta para crear el bloque en el lote
router.post('/crear', controller.post_bloques); 

// Ruta para obtener los contenedores de categorias
router.get('/contenedores', controller.get_contenedores);

// Obtener todas los sustratos de categorias
router.get('/sustratos', controller.get_sustratos);

// Actualización masiva de bloques de un lote
router.put('/masivo', controller.actualizar_bloques_masivo);

// Conseguir las notas de un bloque
router.get('/notas/:id_bloque', controller.get_notas_by_id);

// Crear una nota de un bloque
router.post('/notas/crear', controller.post_nota);

module.exports = router;
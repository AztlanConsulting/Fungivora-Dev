// backend/routes/inoculo.routes.js
const express = require('express');
const router = express.Router();
const inoculoController = require('../controllers/inoculo.controller');

// GET /api/inoculos/especies
// Devuelve todas las especies únicas registradas en la tabla Inoculos
router.get('/especies', inoculoController.get_especies);
// GET /api/inoculos/filtrado
// Devuelve todos los inóculos que concidan en tipo y especie con la petición
router.get('/filtrado', inoculoController.get_inoculos_filtrados);

// GET /api/inoculos
// Devuelve todos los inóculos registrados en la tabla Inoculos
router.get('/', inoculoController.get_inoculos);

// GET /api/inoculos/cantidad-ingredientes
// Devuelve la cantidad total de ingredientes disponibles 
router.get('/cantidad-ingredientes', inoculoController.get_cantidad_ingredientes);

//POST /api/inoculos/crear
// Crea un nuevo inóculo (agar, medio liquido o semilla) en la tabla Inoculos
router.post('/crear', inoculoController.post_crear_inoculo);

module.exports = router;

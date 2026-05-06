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
// GET /api/inoculos/codigo
// Devuelve el codigo_fungivora del inóculo por su ID
router.get('/codigo', inoculoController.get_codigo_fungivora);

module.exports = router;

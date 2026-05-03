// backend/routes/inoculo.routes.js
const express = require('express');
const router = express.Router();
const inoculoController = require('../controllers/inoculo.controller');
 
// GET /api/inoculos/especies
// Devuelve todas las especies únicas registradas en la tabla Inoculos
router.get('/especies', inoculoController.get_especies);
 
module.exports = router;
 
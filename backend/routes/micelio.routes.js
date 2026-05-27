// backend/routes/micelio.routes.js
const express = require('express');
const router = express.Router();
const micelioController = require('../controllers/micelio.controller');

// Ruta para crear el medio líquido (POST)
router.post('/crear-medio-liquido', micelioController.post_crear_medio_liquido);

// Ruta para obtener los agares base para el Select (GET)
// Esta la usarás para llenar el dropdown en la UI
router.get('/agares-base', micelioController.get_agares_base);

module.exports = router;
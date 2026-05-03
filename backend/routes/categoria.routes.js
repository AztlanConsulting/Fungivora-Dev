const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');

// GET /api/categorias/
router.get('/', categoriaController.get_categorias)
// GET /api/categorias/opciones
router.get('/opciones', categoriaController.get_opciones);

module.exports = router;

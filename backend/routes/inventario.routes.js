const express = require('express');
const router = express.Router();

const controller = require('../controllers/inventario.controller');

//Obtener la vista de inventario
router.get('/', controller.get_inventory);

module.exports = router;
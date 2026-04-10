const express = require('express');
const router = express.Router();

const controller = require('../controllers/inventario.controller');

router.get('/', controller.get_inventory);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/prueba_db.controller');

router.get('/estres', controller.get_data);

module.exports = router;
const express = require('express');
const router  = express.Router();
const agarController = require('../controllers/agar.controller');

router.get('/seleccionar-agar', agarController.get_seleccionar_agar);
router.get('/registraragar',    agarController.get_agar);
router.post('/registraragar',   agarController.post_anadir_agar);

module.exports = router;
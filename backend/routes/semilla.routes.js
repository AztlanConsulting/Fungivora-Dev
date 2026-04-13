const express = require('express');
const router  = express.Router();
const semillaController = require('../controllers/Semilla.controller');

router.get('/seleccionar-semilla', semillaController.get_seleccionar_semilla);
router.get('/registrarsemilla',    semillaController.get_semilla);
router.post('/registrarsemilla',   semillaController.post_anadir_semilla);

module.exports = router;
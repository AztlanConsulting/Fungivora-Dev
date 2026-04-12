const express = require('express');
const router = express.Router();

const loginRoutes = require('./inicio_sesion.routes');
const pruebaRoutes = require('./prueba_db.routes');
const inventarioRoutes = require('./inventario.routes')

router.use('/login', loginRoutes);
router.use('/prueba', pruebaRoutes);
router.use('/inventario', inventarioRoutes);

module.exports = router;
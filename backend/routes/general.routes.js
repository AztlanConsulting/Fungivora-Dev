const express = require('express');
const router = express.Router();

const loginRoutes = require('./inicio_sesion.routes');
const pruebaRoutes = require('./prueba_db.routes');
const inventarioRoutes = require('./inventario.routes')
const semillaRoutes = require('./semilla.routes');
const agarRoutes = require('./agar.routes'); 

router.use('/login', loginRoutes);
router.use('/prueba', pruebaRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/inventario', semillaRoutes);
router.use('/inventario', agarRoutes); 

module.exports = router;
const express = require('express');
const router = express.Router();

const loginRoutes = require('./inicio_sesion.routes');
const inventarioRoutes = require('./inventario.routes');
const inoculoRoutes = require('./inoculo.routes');
const categoriaRoutes = require('./categoria.routes');
const lotesRoutes = require('./lotes.routes');
const bloqueRoutes = require('./bloque.routes');
const dashboardRoutes = require('./dashboard.routes');
const micelioRoutes = require('./micelio.routes');
const pushRoutes = require('./push.routes');

// Pasar por autenticación
const auth = require('../middleware/auth');

// Rutas sin token
router.use('/login', loginRoutes);

// Usar la autenticación
router.use(auth);

// Rutas que sí necesitan el token
router.use('/inventario', inventarioRoutes);
router.use('/inoculos', inoculoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/lotes', lotesRoutes);
router.use('/bloques', bloqueRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/micelio', micelioRoutes);
router.use('/push', pushRoutes);

module.exports = router;
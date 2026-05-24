const express = require('express');
const router = express.Router();

const loginRoutes = require('./inicio_sesion.routes');
const inventarioRoutes = require('./inventario.routes');
const inoculoRoutes = require('./inoculo.routes');
const categoriaRoutes = require('./categoria.routes');
const lotesRoutes = require('./lotes.routes');
const bloqueRoutes = require('./bloque.routes');
const dashboardRoutes = require('./dashboard.routes');

// Pasar por atenticación
const auth = require('../middleware/auth'); 

// Rutas sin token
router.use('/login', loginRoutes);

// Usar la autenticación
router.use(auth);

// Rutes que si necesitan el token
router.use('/inventario', inventarioRoutes);
router.use('/inoculos', inoculoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/lotes', lotesRoutes);
router.use('/bloques', bloqueRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
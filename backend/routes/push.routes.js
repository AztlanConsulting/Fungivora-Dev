const express = require('express');
const router = express.Router();
const pushController = require('../controllers/push.controller');
const verificarRol = require('../middleware/rbac');

// Cualquier usuario autenticado puede activar o desactivar su subscripción en su propio equipo
router.post('/subscribe', pushController.subscribe);
router.delete('/unsubscribe', pushController.unsubscribe);

// Broadcast solo para admins
router.post('/send', verificarRol(true), pushController.sendNotification);

module.exports = router;

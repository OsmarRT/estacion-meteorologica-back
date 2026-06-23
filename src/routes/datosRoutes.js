const express = require('express');
const { obtenerUltimoDato, obtenerHistorialDatos } = require('../controllers/datosController');

const router = express.Router();

router.get('/ultimo', obtenerUltimoDato);
router.get('/historial', obtenerHistorialDatos);

module.exports = router;

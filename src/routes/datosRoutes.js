const express = require('express');
const {
  obtenerUltimoDato,
  obtenerHistorialDatos,
  exportDatosCapturadosCsv,
} = require('../controllers/datosController');

const router = express.Router();

router.get('/ultimo', obtenerUltimoDato);
router.get('/historial', obtenerHistorialDatos);
router.get('/export/csv', exportDatosCapturadosCsv);

module.exports = router;
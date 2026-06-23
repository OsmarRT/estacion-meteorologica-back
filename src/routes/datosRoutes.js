const express = require('express');
const { exportDatosCapturadosCsv } = require('../controllers/datosController');

const router = express.Router();

router.get('/export/csv', exportDatosCapturadosCsv);

module.exports = router;

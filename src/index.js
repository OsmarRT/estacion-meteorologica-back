const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const { port } = require('./config');
const swaggerSpec = require('./docs/swagger');
const { initMqtt } = require('./mqttService');

const app = express();
// Cambio: inicialización MQTT en segundo plano al arrancar la API.
const mqttClient = initMqtt();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.json({
    message: 'API activa',
    docs: '/api/docs',
    health: '/api/health',
  });
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.post('/api/dispositivo/comando', (req, res) => {
  // Cambio: este endpoint publica comandos hacia el tópico de dispositivos.
  if (!mqttClient || !mqttClient.connected) {
    return res.status(503).json({ error: 'El servicio MQTT no está disponible' });
  }

  const { accion } = req.body;

  if (!accion) {
    return res.status(400).json({
      message: 'accion es requerida',
    });
  }

  const topicComandos = 'dispositivos/comandos';

  mqttClient.publish(topicComandos, JSON.stringify({ comando: accion }));

  return res.json({
    status: `Comando [${accion}] enviado con éxito`,
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

module.exports = app;
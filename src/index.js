const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const { port } = require('./config');
const swaggerSpec = require('./docs/swagger');

const app = express();

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

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

module.exports = app;
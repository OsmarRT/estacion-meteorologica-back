const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { port } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

module.exports = app;
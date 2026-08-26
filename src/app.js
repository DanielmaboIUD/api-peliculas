const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const rutas = require('./routes');
const noEncontrado = require('./middlewares/noEncontrado');
const manejarErrores = require('./middlewares/manejarErrores');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({ exito: true, mensaje: 'API en funcionamiento', fecha: new Date().toISOString() });
});

app.use('/api', rutas);

app.use(noEncontrado);
app.use(manejarErrores);

module.exports = app;

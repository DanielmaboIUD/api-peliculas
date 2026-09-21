const { asegurarConexion } = require('../config/db');

// Ninguna ruta de /api se atiende sin conexion a MongoDB.
function requiereConexion(req, res, next) {
  asegurarConexion().then(() => next(), next);
}

module.exports = requiereConexion;

const ApiError = require('../utils/ApiError');
const { asegurarConexion } = require('../config/db');

// Ninguna ruta de /api se atiende sin conexion a MongoDB. La causa del fallo
// queda en el log; al cliente le llega un mensaje legible.
function requiereConexion(req, res, next) {
  asegurarConexion().then(
    () => next(),
    (error) => {
      console.error('[DB] No fue posible conectar:', error.message);
      next(new ApiError(500, 'No fue posible conectar con la base de datos. Intente de nuevo en unos segundos.'));
    }
  );
}

module.exports = requiereConexion;

const ApiError = require('../utils/ApiError');

/**
 * Captura cualquier ruta no definida en la API.
 */
function noEncontrado(req, res, next) {
  next(new ApiError(404, `La ruta ${req.method} ${req.originalUrl} no existe en esta API`));
}

module.exports = noEncontrado;

const ApiError = require('../utils/ApiError');

function noEncontrado(req, res, next) {
  next(new ApiError(404, `La ruta ${req.method} ${req.originalUrl} no existe en esta API`));
}

module.exports = noEncontrado;

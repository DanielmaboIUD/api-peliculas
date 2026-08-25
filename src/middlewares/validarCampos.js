const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Revisa el resultado de express-validator y corta la peticion si hay errores.
 */
function validarCampos(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const detalles = errores.array().map((e) => ({ campo: e.path, mensaje: e.msg }));
    return next(new ApiError(400, 'Error de validacion de datos', detalles));
  }
  return next();
}

module.exports = validarCampos;

const ApiError = require('../utils/ApiError');

/**
 * Middleware central de errores: traduce los errores de Mongoose y de la app
 * a respuestas JSON coherentes.
 */
// eslint-disable-next-line no-unused-vars
function manejarErrores(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let mensaje = err.message || 'Error interno del servidor';
  let detalles = err.detalles;

  // ID de Mongo con formato invalido
  if (err.name === 'CastError') {
    statusCode = 400;
    mensaje = `El valor '${err.value}' no es un identificador valido para el campo '${err.path}'`;
  }

  // Validaciones del esquema de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    mensaje = 'Error de validacion de datos';
    detalles = Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message }));
  }

  // Violacion de indice unico
  if (err.code === 11000) {
    statusCode = 409;
    const campo = Object.keys(err.keyValue || {})[0];
    mensaje = `Ya existe un registro con el valor '${err.keyValue[campo]}' en el campo '${campo}'`;
  }

  if (statusCode === 500 && !(err instanceof ApiError)) {
    console.error('[ERROR]', err);
  }

  const cuerpo = { exito: false, mensaje };
  if (detalles) cuerpo.detalles = detalles;
  return res.status(statusCode).json(cuerpo);
}

module.exports = manejarErrores;

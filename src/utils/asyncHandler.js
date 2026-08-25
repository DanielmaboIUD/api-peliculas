/**
 * Envuelve un controlador asincrono para enviar cualquier error al middleware de errores.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

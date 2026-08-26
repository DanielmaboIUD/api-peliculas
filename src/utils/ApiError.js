class ApiError extends Error {
  constructor(statusCode, mensaje, detalles = undefined) {
    super(mensaje);
    this.statusCode = statusCode;
    this.detalles = detalles;
    this.esOperacional = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;

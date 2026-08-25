const { param } = require('express-validator');

// Valida que el parametro :id sea un ObjectId de MongoDB
const validarIdMongo = param('id').isMongoId().withMessage('El id enviado no es un id valido de MongoDB');

module.exports = { validarIdMongo };

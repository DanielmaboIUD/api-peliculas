const { param } = require('express-validator');

const validarIdMongo = param('id').isMongoId().withMessage('El id enviado no es un id valido de MongoDB');

module.exports = { validarIdMongo };

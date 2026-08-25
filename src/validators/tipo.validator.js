const { body } = require('express-validator');

const crearTipo = [
  body('nombre').trim().notEmpty().withMessage('El nombre del tipo es obligatorio').isLength({ max: 100 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
];

const actualizarTipo = [
  body('nombre').optional().trim().notEmpty().isLength({ max: 100 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
];

module.exports = { crearTipo, actualizarTipo };

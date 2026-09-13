const { body } = require('express-validator');
const { ESTADOS } = require('../utils/constantes');

const crearGenero = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede superar los 100 caracteres'),
  body('estado').optional().isIn(ESTADOS).withMessage('El estado debe ser Activo o Inactivo'),
  body('descripcion').optional().trim().isLength({ max: 500 }),
];

const actualizarGenero = [
  body('nombre').optional().trim().notEmpty().isLength({ max: 100 }),
  body('estado').optional().isIn(ESTADOS).withMessage('El estado debe ser Activo o Inactivo'),
  body('descripcion').optional().trim().isLength({ max: 500 }),
];

module.exports = { crearGenero, actualizarGenero };

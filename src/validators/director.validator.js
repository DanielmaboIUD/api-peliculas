const { body } = require('express-validator');
const { ESTADOS } = require('../utils/constantes');

const crearDirector = [
  body('nombres')
    .trim()
    .notEmpty()
    .withMessage('Los nombres son obligatorios')
    .isLength({ max: 150 })
    .withMessage('Los nombres no pueden superar los 150 caracteres'),
  body('estado').optional().isIn(ESTADOS).withMessage('El estado debe ser Activo o Inactivo'),
];

const actualizarDirector = [
  body('nombres').optional().trim().notEmpty().isLength({ max: 150 }),
  body('estado').optional().isIn(ESTADOS).withMessage('El estado debe ser Activo o Inactivo'),
];

module.exports = { crearDirector, actualizarDirector };

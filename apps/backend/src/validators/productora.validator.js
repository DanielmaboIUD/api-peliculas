const { body } = require('express-validator');
const { ESTADOS } = require('../utils/constantes');

const crearProductora = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la productora es obligatorio')
    .isLength({ max: 150 }),
  body('estado').optional().isIn(ESTADOS).withMessage('El estado debe ser Activo o Inactivo'),
  body('slogan').optional().trim().isLength({ max: 200 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
];

const actualizarProductora = [
  body('nombre').optional().trim().notEmpty().isLength({ max: 150 }),
  body('estado').optional().isIn(ESTADOS).withMessage('El estado debe ser Activo o Inactivo'),
  body('slogan').optional().trim().isLength({ max: 200 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
];

module.exports = { crearProductora, actualizarProductora };

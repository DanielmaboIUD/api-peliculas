const { body } = require('express-validator');

const anioMaximo = new Date().getFullYear() + 5;

const crearMedia = [
  body('serial').trim().notEmpty().withMessage('El serial es obligatorio').isLength({ max: 50 }),
  body('titulo').trim().notEmpty().withMessage('El titulo es obligatorio').isLength({ max: 200 }),
  body('sinopsis').trim().notEmpty().withMessage('La sinopsis es obligatoria').isLength({ max: 2000 }),
  body('url').trim().notEmpty().withMessage('La URL es obligatoria').isURL().withMessage('La URL no tiene un formato valido'),
  body('imagenPortada')
    .trim()
    .notEmpty()
    .withMessage('La imagen de portada es obligatoria')
    .isURL()
    .withMessage('La imagen de portada debe ser una URL valida'),
  body('anioEstreno')
    .notEmpty()
    .withMessage('El anio de estreno es obligatorio')
    .isInt({ min: 1888, max: anioMaximo })
    .withMessage(`El anio de estreno debe estar entre 1888 y ${anioMaximo}`),
  body('genero').notEmpty().withMessage('El genero es obligatorio').isMongoId().withMessage('El genero debe ser un id valido'),
  body('director').notEmpty().withMessage('El director es obligatorio').isMongoId().withMessage('El director debe ser un id valido'),
  body('productora').notEmpty().withMessage('La productora es obligatoria').isMongoId().withMessage('La productora debe ser un id valido'),
  body('tipo').notEmpty().withMessage('El tipo es obligatorio').isMongoId().withMessage('El tipo debe ser un id valido'),
];

const actualizarMedia = [
  body('serial').optional().trim().notEmpty().isLength({ max: 50 }),
  body('titulo').optional().trim().notEmpty().isLength({ max: 200 }),
  body('sinopsis').optional().trim().notEmpty().isLength({ max: 2000 }),
  body('url').optional().trim().isURL().withMessage('La URL no tiene un formato valido'),
  body('imagenPortada').optional().trim().isURL().withMessage('La imagen de portada debe ser una URL valida'),
  body('anioEstreno').optional().isInt({ min: 1888, max: anioMaximo }),
  body('genero').optional().isMongoId(),
  body('director').optional().isMongoId(),
  body('productora').optional().isMongoId(),
  body('tipo').optional().isMongoId(),
];

module.exports = { crearMedia, actualizarMedia };

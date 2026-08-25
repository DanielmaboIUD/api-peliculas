const Genero = require('../models/Genero');
const crudFactory = require('./crudFactory');

// Modulo de Genero: CRUD completo + cambio de estado
module.exports = crudFactory(Genero, 'Genero', ['nombre', 'descripcion'], 'genero');

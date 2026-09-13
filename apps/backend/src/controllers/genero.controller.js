const Genero = require('../models/Genero');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Genero, 'Genero', ['nombre', 'descripcion'], 'genero');

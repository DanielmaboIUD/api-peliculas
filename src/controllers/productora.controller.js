const Productora = require('../models/Productora');
const crudFactory = require('./crudFactory');

// Modulo de Productora: CRUD completo + cambio de estado
module.exports = crudFactory(Productora, 'Productora', ['nombre', 'slogan', 'descripcion'], 'productora');

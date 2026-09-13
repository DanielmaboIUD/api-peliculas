const Productora = require('../models/Productora');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Productora, 'Productora', ['nombre', 'slogan', 'descripcion'], 'productora');

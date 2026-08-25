const Director = require('../models/Director');
const crudFactory = require('./crudFactory');

// Modulo de Director: CRUD completo + cambio de estado
module.exports = crudFactory(Director, 'Director', ['nombres'], 'director');

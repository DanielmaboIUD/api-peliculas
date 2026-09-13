const Director = require('../models/Director');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Director, 'Director', ['nombres'], 'director');

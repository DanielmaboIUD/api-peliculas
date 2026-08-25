const Tipo = require('../models/Tipo');
const crudFactory = require('./crudFactory');

// Modulo de Tipo: CRUD completo (este modulo no maneja estado segun el caso de estudio)
const { listar, obtener, crear, actualizar, eliminar } = crudFactory(Tipo, 'Tipo', [
  'nombre',
  'descripcion',
], 'tipo');

module.exports = { listar, obtener, crear, actualizar, eliminar };

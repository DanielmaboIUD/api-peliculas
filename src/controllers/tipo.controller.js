const Tipo = require('../models/Tipo');
const crudFactory = require('./crudFactory');

// Sin PATCH /estado: el caso de estudio no pide estado para Tipo.
const { listar, obtener, crear, actualizar, eliminar } = crudFactory(Tipo, 'Tipo', [
  'nombre',
  'descripcion',
], 'tipo');

module.exports = { listar, obtener, crear, actualizar, eliminar };

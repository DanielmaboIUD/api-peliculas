const { Schema, model } = require('mongoose');
const { ESTADOS } = require('../utils/constantes');

/**
 * Modulo de Genero
 * Registra y edita los generos de las producciones (accion, drama, terror, ...).
 * Una produccion se clasifica en un unico genero.
 */
const generoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del genero es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [100, 'El nombre no puede superar los 100 caracteres'],
    },
    estado: {
      type: String,
      enum: {
        values: ESTADOS,
        message: 'El estado debe ser Activo o Inactivo',
      },
      default: 'Activo',
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripcion no puede superar los 500 caracteres'],
      default: '',
    },
  },
  {
    // Mongoose crea y mantiene fechaCreacion y fechaActualizacion
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
    versionKey: false,
  }
);

module.exports = model('Genero', generoSchema);

const { Schema, model } = require('mongoose');
const { ESTADOS } = require('../utils/constantes');

/**
 * Modulo de Productora
 * Registra y edita la productora principal (Disney, Warner, Paramount, MGM, ...).
 */
const productoraSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la productora es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [150, 'El nombre no puede superar los 150 caracteres'],
    },
    estado: {
      type: String,
      enum: {
        values: ESTADOS,
        message: 'El estado debe ser Activo o Inactivo',
      },
      default: 'Activo',
    },
    slogan: {
      type: String,
      trim: true,
      maxlength: [200, 'El slogan no puede superar los 200 caracteres'],
      default: '',
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripcion no puede superar los 500 caracteres'],
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
    versionKey: false,
  }
);

module.exports = model('Productora', productoraSchema);

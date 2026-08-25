const { Schema, model } = require('mongoose');

/**
 * Modulo de Tipo
 * Registra los tipos de multimedia: serie, pelicula y los que se necesiten a futuro.
 * Segun el caso de estudio este modulo no maneja estado.
 */
const tipoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del tipo es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [100, 'El nombre no puede superar los 100 caracteres'],
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

module.exports = model('Tipo', tipoSchema);

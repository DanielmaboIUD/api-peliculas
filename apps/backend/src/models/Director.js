const { Schema, model } = require('mongoose');
const { ESTADOS } = require('../utils/constantes');

const directorSchema = new Schema(
  {
    nombres: {
      type: String,
      required: [true, 'Los nombres del director son obligatorios'],
      trim: true,
      maxlength: [150, 'Los nombres no pueden superar los 150 caracteres'],
    },
    estado: {
      type: String,
      enum: {
        values: ESTADOS,
        message: 'El estado debe ser Activo o Inactivo',
      },
      default: 'Activo',
    },
  },
  {
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
    versionKey: false,
  }
);

module.exports = model('Director', directorSchema);

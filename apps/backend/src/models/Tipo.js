const { Schema, model } = require('mongoose');

// A diferencia de los otros catalogos, Tipo no lleva estado: el caso no lo pide.
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

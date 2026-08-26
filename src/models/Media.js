const { Schema, model } = require('mongoose');

const mediaSchema = new Schema(
  {
    serial: {
      type: String,
      required: [true, 'El serial es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [50, 'El serial no puede superar los 50 caracteres'],
    },
    titulo: {
      type: String,
      required: [true, 'El titulo es obligatorio'],
      trim: true,
      maxlength: [200, 'El titulo no puede superar los 200 caracteres'],
    },
    sinopsis: {
      type: String,
      required: [true, 'La sinopsis es obligatoria'],
      trim: true,
      maxlength: [2000, 'La sinopsis no puede superar los 2000 caracteres'],
    },
    url: {
      type: String,
      required: [true, 'La URL de la produccion es obligatoria'],
      unique: true,
      trim: true,
    },
    imagenPortada: {
      type: String,
      required: [true, 'La imagen de portada es obligatoria'],
      trim: true,
    },
    anioEstreno: {
      type: Number,
      required: [true, 'El anio de estreno es obligatorio'],
      min: [1888, 'El anio de estreno no puede ser anterior a 1888'],
      max: [new Date().getFullYear() + 5, 'El anio de estreno no es valido'],
    },
    genero: {
      type: Schema.Types.ObjectId,
      ref: 'Genero',
      required: [true, 'El genero principal es obligatorio'],
    },
    director: {
      type: Schema.Types.ObjectId,
      ref: 'Director',
      required: [true, 'El director principal es obligatorio'],
    },
    productora: {
      type: Schema.Types.ObjectId,
      ref: 'Productora',
      required: [true, 'La productora es obligatoria'],
    },
    tipo: {
      type: Schema.Types.ObjectId,
      ref: 'Tipo',
      required: [true, 'El tipo es obligatorio'],
    },
  },
  {
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
    versionKey: false,
  }
);

// Poblar automaticamente las relaciones en todas las consultas find
mediaSchema.pre(/^find/, function (next) {
  this.populate('genero', 'nombre estado')
    .populate('director', 'nombres estado')
    .populate('productora', 'nombre estado')
    .populate('tipo', 'nombre');
  next();
});

module.exports = model('Media', mediaSchema);

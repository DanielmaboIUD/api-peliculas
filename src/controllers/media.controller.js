const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/respuesta');

// Regla del caso de estudio: solo se aceptan genero, director y productora
// en estado Activo. El tipo unicamente debe existir.
async function validarRelaciones({ genero, director, productora, tipo }) {
  const errores = [];

  if (genero) {
    const doc = await Genero.findById(genero);
    if (!doc) errores.push({ campo: 'genero', mensaje: 'El genero indicado no existe' });
    else if (doc.estado !== 'Activo')
      errores.push({ campo: 'genero', mensaje: `El genero '${doc.nombre}' esta Inactivo` });
  }

  if (director) {
    const doc = await Director.findById(director);
    if (!doc) errores.push({ campo: 'director', mensaje: 'El director indicado no existe' });
    else if (doc.estado !== 'Activo')
      errores.push({ campo: 'director', mensaje: `El director '${doc.nombres}' esta Inactivo` });
  }

  if (productora) {
    const doc = await Productora.findById(productora);
    if (!doc) errores.push({ campo: 'productora', mensaje: 'La productora indicada no existe' });
    else if (doc.estado !== 'Activo')
      errores.push({ campo: 'productora', mensaje: `La productora '${doc.nombre}' esta Inactiva` });
  }

  if (tipo) {
    const doc = await Tipo.findById(tipo);
    if (!doc) errores.push({ campo: 'tipo', mensaje: 'El tipo indicado no existe' });
  }

  if (errores.length) {
    throw new ApiError(400, 'No se puede guardar la produccion por referencias invalidas', errores);
  }
}

async function obtenerOFallar(id) {
  const media = await Media.findById(id);
  if (!media) throw new ApiError(404, `Produccion con id ${id} no encontrada`);
  return media;
}

const listar = asyncHandler(async (req, res) => {
  const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1);
  const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 10, 1), 100);

  const filtro = {};
  if (req.query.genero) filtro.genero = req.query.genero;
  if (req.query.director) filtro.director = req.query.director;
  if (req.query.productora) filtro.productora = req.query.productora;
  if (req.query.tipo) filtro.tipo = req.query.tipo;
  if (req.query.anioEstreno) filtro.anioEstreno = Number(req.query.anioEstreno);
  if (req.query.buscar) {
    filtro.$or = [
      { titulo: { $regex: req.query.buscar, $options: 'i' } },
      { sinopsis: { $regex: req.query.buscar, $options: 'i' } },
      { serial: { $regex: req.query.buscar, $options: 'i' } },
    ];
  }

  const [total, datos] = await Promise.all([
    Media.countDocuments(filtro),
    Media.find(filtro)
      .sort({ fechaCreacion: -1 })
      .skip((pagina - 1) * limite)
      .limit(limite),
  ]);

  return ok(res, {
    mensaje: 'Listado de producciones',
    meta: { total, pagina, limite, paginas: Math.ceil(total / limite) || 1 },
    datos,
  });
});

const obtener = asyncHandler(async (req, res) => {
  const media = await obtenerOFallar(req.params.id);
  return ok(res, { mensaje: 'Produccion encontrada', datos: media });
});

const crear = asyncHandler(async (req, res) => {
  await validarRelaciones(req.body);
  const media = await Media.create(req.body);
  const creada = await Media.findById(media._id);
  return ok(res, { statusCode: 201, mensaje: 'Produccion creada correctamente', datos: creada });
});

const actualizar = asyncHandler(async (req, res) => {
  await obtenerOFallar(req.params.id);
  await validarRelaciones(req.body);
  const media = await Media.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return ok(res, { mensaje: 'Produccion actualizada correctamente', datos: media });
});

const eliminar = asyncHandler(async (req, res) => {
  const media = await obtenerOFallar(req.params.id);
  await media.deleteOne();
  return ok(res, { mensaje: 'Produccion eliminada correctamente', datos: { id: req.params.id } });
});

module.exports = { listar, obtener, crear, actualizar, eliminar };

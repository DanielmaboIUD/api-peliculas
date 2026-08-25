process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');

let fallos = 0;
function check(n, cond, extra = '') { if (cond) console.log(`  OK    ${n}`); else { fallos++; console.log(`  FALLA ${n}  ${extra}`); } }

// ---------- 1. Modelos ----------
console.log('\n== 1. Modelos y validaciones de esquema ==');
const Genero = require('./src/models/Genero');
const Director = require('./src/models/Director');
const Productora = require('./src/models/Productora');
const Tipo = require('./src/models/Tipo');
const Media = require('./src/models/Media');

const g = new Genero({});
let e = g.validateSync();
check('Genero exige nombre', !!e.errors.nombre);
check('Genero estado por defecto Activo', g.estado === 'Activo');
check('Genero tiene timestamps renombrados', Genero.schema.options.timestamps.createdAt === 'fechaCreacion' && Genero.schema.options.timestamps.updatedAt === 'fechaActualizacion');
e = new Genero({ nombre: 'X', estado: 'Otro' }).validateSync();
check('Genero rechaza estado invalido', !!e.errors.estado);
check('Director exige nombres', !!new Director({}).validateSync().errors.nombres);
check('Productora exige nombre', !!new Productora({}).validateSync().errors.nombre);
check('Productora tiene slogan y descripcion', !!Productora.schema.path('slogan') && !!Productora.schema.path('descripcion'));
check('Tipo NO maneja estado (segun el caso)', !Tipo.schema.path('estado'));
check('Tipo exige nombre', !!new Tipo({}).validateSync().errors.nombre);

const eM = new Media({}).validateSync();
['serial','titulo','sinopsis','url','imagenPortada','anioEstreno','genero','director','productora','tipo']
  .forEach((c) => check(`Media exige ${c}`, !!eM.errors[c]));
check('Media.serial es unico', Media.schema.path('serial').options.unique === true);
check('Media.url es unica', Media.schema.path('url').options.unique === true);
check('Media referencia Genero', Media.schema.path('genero').options.ref === 'Genero');
check('Media referencia Director', Media.schema.path('director').options.ref === 'Director');
check('Media referencia Productora', Media.schema.path('productora').options.ref === 'Productora');
check('Media referencia Tipo', Media.schema.path('tipo').options.ref === 'Tipo');
check('Media rechaza anio 1500', !!new Media({ anioEstreno: 1500 }).validateSync().errors.anioEstreno);

// ---------- 2. Rutas registradas ----------
console.log('\n== 2. Rutas expuestas por la API ==');
const app = require('./src/app');
const rutas = [];
function recorrer(pila, prefijo = '') {
  pila.forEach((capa) => {
    if (capa.route) {
      Object.keys(capa.route.methods).forEach((m) => rutas.push(`${m.toUpperCase()} ${prefijo}${capa.route.path}`));
    } else if (capa.name === 'router' && capa.handle.stack) {
      const p = capa.regexp.source.replace('^\\/','/').replace('\\/?(?=\\/|$)','').replace(/\\\//g,'/').replace(/\$$/,'');
      recorrer(capa.handle.stack, prefijo + (p === '/(?:/)?' ? '' : p));
    }
  });
}
recorrer(app._router.stack);
const norm = (x) => x.replace(/\/$/, '');
const rutasNorm = rutas.map(norm);
const esperadas = [];
['generos','directores','productoras','tipos','medias'].forEach((m) => {
  esperadas.push(`GET /api/${m}`, `GET /api/${m}/:id`, `POST /api/${m}`, `PUT /api/${m}/:id`, `DELETE /api/${m}/:id`);
});
['generos','directores','productoras'].forEach((m) => esperadas.push(`PATCH /api/${m}/:id/estado`));
esperadas.forEach((r) => check(r, rutasNorm.includes(norm(r)), `\n     registradas: ${rutas.join(', ')}`));
check('Tipo no expone PATCH estado', !rutasNorm.includes('PATCH /api/tipos/:id/estado'));

// ---------- 3. Middleware de errores ----------
console.log('\n== 3. Traduccion de errores ==');
const manejarErrores = require('./src/middlewares/manejarErrores');
function simular(err) {
  let out = {};
  const res = { status(c) { out.status = c; return this; }, json(b) { out.body = b; return this; } };
  manejarErrores(err, {}, res, () => {});
  return out;
}
let r = simular({ name: 'CastError', value: 'abc', path: '_id' });
check('CastError -> 400', r.status === 400);
r = simular({ code: 11000, keyValue: { nombre: 'Accion' } });
check('Clave duplicada -> 409', r.status === 409 && /Accion/.test(r.body.mensaje));
r = simular({ name: 'ValidationError', errors: { nombre: { path: 'nombre', message: 'obligatorio' } } });
check('ValidationError -> 400 con detalles', r.status === 400 && r.body.detalles[0].campo === 'nombre');
const ApiError = require('./src/utils/ApiError');
r = simular(new ApiError(404, 'no existe'));
check('ApiError respeta su codigo', r.status === 404 && r.body.exito === false);

// ---------- 4. Peticiones HTTP reales (sin base de datos) ----------
console.log('\n== 4. Peticiones HTTP: rutas, validaciones y regla de negocio ==');
const servidor = app.listen(0);
const puerto = servidor.address().port;
const req = async (metodo, ruta, cuerpo) => {
  const resp = await fetch(`http://127.0.0.1:${puerto}${ruta}`, {
    method: metodo, headers: { 'Content-Type': 'application/json' },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  return { status: resp.status, json: await resp.json() };
};

(async () => {
  let r = await req('GET', '/health');
  check('GET /health responde 200', r.status === 200 && r.json.exito === true);
  r = await req('GET', '/api');
  check('GET /api lista los 5 modulos', r.status === 200 && Object.keys(r.json.modulos).length === 5);
  r = await req('GET', '/api/no-existe');
  check('Ruta inexistente -> 404', r.status === 404 && r.json.exito === false);

  r = await req('POST', '/api/generos', { nombre: '' });
  check('POST genero sin nombre -> 400', r.status === 400 && r.json.detalles[0].campo === 'nombre');
  r = await req('POST', '/api/generos', { nombre: 'Accion', estado: 'Raro' });
  check('POST genero estado invalido -> 400', r.status === 400);
  r = await req('GET', '/api/generos/id-malo');
  check('GET con id no valido -> 400', r.status === 400);
  r = await req('POST', '/api/directores', {});
  check('POST director vacio -> 400', r.status === 400);
  r = await req('POST', '/api/productoras', { nombre: '' });
  check('POST productora sin nombre -> 400', r.status === 400);
  r = await req('POST', '/api/tipos', {});
  check('POST tipo vacio -> 400', r.status === 400);
  r = await req('POST', '/api/medias', {});
  check('POST media vacio -> 400 con 10 campos', r.status === 400 && r.json.detalles.length >= 10, JSON.stringify(r.json).slice(0,200));
  r = await req('POST', '/api/medias', {
    serial: 'S1', titulo: 'T', sinopsis: 'S', url: 'esto-no-es-url', imagenPortada: 'https://a.co/x.jpg',
    anioEstreno: 2020, genero: '507f1f77bcf86cd799439011', director: '507f1f77bcf86cd799439011',
    productora: '507f1f77bcf86cd799439011', tipo: '507f1f77bcf86cd799439011' });
  check('POST media con URL invalida -> 400', r.status === 400 && r.json.detalles.some((d) => d.campo === 'url'));

  // --- Regla del caso: solo se aceptan referencias ACTIVAS ---
  const id = '507f1f77bcf86cd799439011';
  const payload = { serial: 'MOV-1', titulo: 'Interstellar', sinopsis: 'Sinopsis de prueba',
    url: 'https://peliculas.iudigital.edu.co/interstellar', imagenPortada: 'https://peliculas.iudigital.edu.co/p.jpg',
    anioEstreno: 2014, genero: id, director: id, productora: id, tipo: id };

  const stub = (Modelo, doc) => { Modelo.findById = async () => doc; };
  stub(Director, { _id: id, nombres: 'Nolan', estado: 'Activo' });
  stub(Productora, { _id: id, nombre: 'Warner', estado: 'Activo' });
  stub(Tipo, { _id: id, nombre: 'Pelicula' });

  stub(Genero, { _id: id, nombre: 'Ciencia ficcion', estado: 'Inactivo' });
  r = await req('POST', '/api/medias', payload);
  check('Rechaza produccion con GENERO inactivo', r.status === 400 && r.json.detalles[0].campo === 'genero', JSON.stringify(r.json));

  stub(Genero, { _id: id, nombre: 'Ciencia ficcion', estado: 'Activo' });
  stub(Director, { _id: id, nombres: 'Nolan', estado: 'Inactivo' });
  r = await req('POST', '/api/medias', payload);
  check('Rechaza produccion con DIRECTOR inactivo', r.status === 400 && r.json.detalles[0].campo === 'director');

  stub(Director, { _id: id, nombres: 'Nolan', estado: 'Activo' });
  stub(Productora, { _id: id, nombre: 'Warner', estado: 'Inactivo' });
  r = await req('POST', '/api/medias', payload);
  check('Rechaza produccion con PRODUCTORA inactiva', r.status === 400 && r.json.detalles[0].campo === 'productora');

  stub(Productora, { _id: id, nombre: 'Warner', estado: 'Activo' });
  stub(Tipo, null);
  r = await req('POST', '/api/medias', payload);
  check('Rechaza produccion con TIPO inexistente', r.status === 400 && r.json.detalles[0].campo === 'tipo');

  stub(Tipo, { _id: id, nombre: 'Pelicula' });
  const creada = { ...payload, _id: '507f1f77bcf86cd799439099' };
  Media.create = async (d) => ({ ...d, _id: creada._id });
  Media.findById = async () => creada;
  r = await req('POST', '/api/medias', payload);
  check('Acepta produccion con TODAS las referencias activas -> 201', r.status === 201 && r.json.datos.titulo === 'Interstellar', JSON.stringify(r.json));

  servidor.close();
  console.log(fallos === 0 ? `\n>>> TODAS LAS COMPROBACIONES PASARON` : `\n>>> ${fallos} COMPROBACIONES FALLARON`);
  process.exit(fallos === 0 ? 0 : 1);
})();

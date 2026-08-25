const mongoose = require('mongoose');

/**
 * Establece la conexion con MongoDB usando la URI del archivo .env
 */
async function conectarDB(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error('No se definio la variable MONGO_URI en el archivo .env');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`[DB] Conectado a MongoDB: ${mongoose.connection.name}`);
  return mongoose.connection;
}

/**
 * Espera a que Mongoose termine de construir los indices de cada modelo.
 * En una base recien creada los indices unique se construyen en segundo plano:
 * sin esta espera, las primeras peticiones alcanzan a insertar duplicados.
 * Devuelve los nombres de los modelos ya sincronizados.
 */
async function sincronizarIndices() {
  const modelos = Object.values(mongoose.models);
  await Promise.all(modelos.map((modelo) => modelo.init()));
  return modelos.map((modelo) => modelo.modelName);
}

module.exports = { conectarDB, sincronizarIndices };
